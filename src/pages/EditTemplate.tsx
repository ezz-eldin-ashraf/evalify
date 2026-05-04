import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Eye, Edit3, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api, { BACKEND_ORIGIN } from '../api/axios';

interface Template {
  templateId: number;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  createdAt: string;
}

interface Question {
  questionId: number;
  questionIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  modelAnswer: string;
  mark: number;
}

interface EditableQuestion extends Question {
  editModelAnswer: string;
  editMark: string;
}

const EditTemplate: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imgRenderedSize, setImgRenderedSize] = useState<{ w: number; h: number } | null>(null);

  const [template, setTemplate] = useState<Template | null>(null);
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [selectedQ, setSelectedQ] = useState<number | null>(null);

  // Fetch template info and questions on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [templatesRes, questionsRes] = await Promise.all([
          api.get('/templates'),
          api.get(`/templates/${templateId}/questions`),
        ]);

        const found: Template | undefined = templatesRes.data.find(
          (t: Template) => t.templateId === Number(templateId)
        );
        if (!found) {
          setError('Template not found.');
          setLoading(false);
          return;
        }
        setTemplate(found);

        const qs: EditableQuestion[] = (questionsRes.data as Question[]).map((q) => ({
          ...q,
          editModelAnswer: q.modelAnswer,
          editMark: String(q.mark),
        }));
        setQuestions(qs);
        if (qs.length > 0) setSelectedQ(qs[0].questionIndex);
      } catch (err) {
        setError('Failed to load template data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [templateId]);

  // Update rendered image size when image loads or window resizes
  const updateRenderedSize = () => {
    const img = imageRef.current;
    if (!img) return;
    // Use the img element's own clientWidth/Height vs naturalWidth/Height
    // so the scale is always derived from the actual rendered pixel area.
    setImgRenderedSize({ w: img.clientWidth, h: img.clientHeight });
  };

  const handleImageLoad = () => updateRenderedSize();

  useEffect(() => {
    window.addEventListener('resize', updateRenderedSize);
    return () => window.removeEventListener('resize', updateRenderedSize);
  }, []);

  // Scale a natural-pixel box to the rendered image size.
  // Use naturalWidth/Height directly from the DOM element — most accurate.
  const scaleBox = (q: Question) => {
    const img = imageRef.current;
    if (!img || !imgRenderedSize) return null;
    const scaleX = img.clientWidth  / img.naturalWidth;
    const scaleY = img.clientHeight / img.naturalHeight;
    return {
      left:   q.x      * scaleX,
      top:    q.y      * scaleY,
      width:  q.width  * scaleX,
      height: q.height * scaleY,
    };
  };

  const handleFieldChange = (
    index: number,
    field: 'editModelAnswer' | 'editMark',
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const questionsPayload = questions.map((q) => ({
        questionIndex: q.questionIndex,
        x: q.x,
        y: q.y,
        width: q.width,
        height: q.height,
        modelAnswer: q.editModelAnswer,
        mark: parseFloat(q.editMark) || 0,
      }));

      await api.post(`/templates/${templateId}/questions`, {
        questions: questionsPayload,
      });

      // Update local state to reflect saved values
      setQuestions((prev) =>
        prev.map((q) => ({
          ...q,
          modelAnswer: q.editModelAnswer,
          mark: parseFloat(q.editMark) || 0,
        }))
      );

      setSuccessMsg('Template saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.title || err.response?.data?.detail || 'Failed to save changes.'
      );
    } finally {
      setSaving(false);
    }
  };

  const COLORS = [
    '#6C63FF', '#FF6584', '#43C59E', '#FF9F43', '#54A0FF',
    '#5F27CD', '#EE5A24', '#009432', '#0652DD', '#D63031',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 gap-3 text-text-muted font-bold">
        <Loader2 size={24} className="animate-spin text-primary" />
        Loading template...
      </div>
    );
  }

  if (error && !template) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4 text-text-muted">
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-bold text-lg">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="text-primary font-bold hover:underline">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl hover:bg-white shadow-sm border border-border/30 transition-all text-text-muted hover:text-primary"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{template?.name}</h2>
            <p className="text-text-muted text-sm font-medium mt-0.5">
              {questions.length} question{questions.length !== 1 ? 's' : ''} mapped
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} strokeWidth={2.5} />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Feedback */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-3 font-semibold text-sm">
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-3 font-semibold text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Tab Toggle */}
      <div className="flex gap-2 bg-white rounded-2xl shadow-strong p-1.5 w-fit">
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'preview'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-primary'
          }`}
        >
          <Eye size={16} /> Preview with Boxes
        </button>
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'edit'
              ? 'bg-primary text-white shadow-sm'
              : 'text-text-secondary hover:text-primary'
          }`}
        >
          <Edit3 size={16} /> Edit Questions
        </button>
      </div>

      {/* ── TAB: PREVIEW ── */}
      {activeTab === 'preview' && (
        <div className="bg-white rounded-[2.5rem] shadow-strong overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[600px]">

            {/* Image with boxes */}
            <div className="flex-1 p-6 bg-bg-surface/40 flex items-start justify-center">
              <div className="relative inline-block">
                <img
                  ref={imageRef}
                  src={`${BACKEND_ORIGIN}${template?.imageUrl}`}
                  alt="Exam Template"
                  onLoad={handleImageLoad}
                  className="max-w-full max-h-[680px] rounded-xl shadow-md block"
                />
                {/* Bounding box overlays */}
                {imgRenderedSize &&
                  questions.map((q, idx) => {
                    const box = scaleBox(q);
                    if (!box) return null;
                    const color = COLORS[idx % COLORS.length];
                    const isSelected = selectedQ === q.questionIndex;
                    return (
                      <div
                        key={q.questionId}
                        onClick={() => setSelectedQ(q.questionIndex)}
                        className="absolute cursor-pointer transition-all duration-200"
                        style={{
                          left: `${box.left}px`,
                          top: `${box.top}px`,
                          width: `${box.width}px`,
                          height: `${box.height}px`,
                          border: `2.5px solid ${color}`,
                          backgroundColor: isSelected
                            ? `${color}33`
                            : `${color}18`,
                          boxShadow: isSelected ? `0 0 0 3px ${color}44` : 'none',
                        }}
                      >
                        {/* Question label badge */}
                        <span
                          className="absolute -top-5 left-0 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-t-md whitespace-nowrap"
                          style={{ backgroundColor: color }}
                        >
                          Q{q.questionIndex} · {q.mark} pts
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Side panel: question detail */}
            <div className="w-full lg:w-[320px] p-6 border-l border-border/20 flex flex-col gap-4 overflow-y-auto">
              <h3 className="font-bold text-text-primary text-base">Questions</h3>
              {questions.length === 0 && (
                <p className="text-text-muted text-sm font-medium">No questions mapped yet.</p>
              )}
              {questions.map((q, idx) => {
                const color = COLORS[idx % COLORS.length];
                const isSelected = selectedQ === q.questionIndex;
                return (
                  <div
                    key={q.questionId}
                    onClick={() => setSelectedQ(q.questionIndex)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary/40 bg-primary/5 shadow-sm'
                        : 'border-border/30 bg-bg-surface/60 hover:border-primary/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg text-white"
                        style={{ backgroundColor: color }}
                      >
                        Q{q.questionIndex}
                      </span>
                      <span className="text-xs font-bold text-text-muted">
                        {q.mark} pts
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-medium line-clamp-3 leading-relaxed">
                      {q.modelAnswer || <span className="italic text-text-muted">No model answer</span>}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: EDIT ── */}
      {activeTab === 'edit' && (
        <div className="space-y-4">
          {questions.length === 0 && (
            <div className="bg-white rounded-[2.5rem] shadow-strong p-12 text-center text-text-muted font-medium">
              No questions mapped for this template.
            </div>
          )}
          {questions.map((q, idx) => {
            const color = COLORS[idx % COLORS.length];
            return (
              <div
                key={q.questionId}
                className="bg-white rounded-[2rem] shadow-strong p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="text-white text-sm font-bold px-3 py-1.5 rounded-xl"
                    style={{ backgroundColor: color }}
                  >
                    Question {q.questionIndex}
                  </span>
                  <span className="text-xs text-text-muted font-medium bg-bg-surface px-3 py-1.5 rounded-lg">
                    Box: {q.x}×{q.y} | {q.width}×{q.height}px
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-5">
                  {/* Model Answer */}
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Model Answer
                    </label>
                    <textarea
                      value={q.editModelAnswer}
                      onChange={(e) =>
                        handleFieldChange(idx, 'editModelAnswer', e.target.value)
                      }
                      rows={4}
                      placeholder="Enter the correct answer for this question..."
                      className="w-full bg-bg-input text-text-primary text-sm font-semibold rounded-xl p-4 border border-transparent focus:border-primary/30 outline-none shadow-sm resize-none transition-all"
                    />
                  </div>

                  {/* Score */}
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Score (Max Mark)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={q.editMark}
                      onChange={(e) => handleFieldChange(idx, 'editMark', e.target.value)}
                      className="w-full bg-bg-input text-text-primary font-bold text-lg rounded-xl py-4 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                    />
                    <p className="text-xs text-text-muted font-medium mt-2">
                      Currently: {q.mark} pts
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom Save */}
          {questions.length > 0 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-[0.98]"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} strokeWidth={2.5} />}
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditTemplate;
