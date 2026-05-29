import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader2, AlertCircle, CheckCircle2, Edit3, Save, X,
  FileText, Image as ImageIcon
} from 'lucide-react';
import api, { BACKEND_ORIGIN } from '../api/axios';

interface AnswerResult {
  answerId: number;
  questionIndex: number;
  modelAnswer: string;
  extractedText: string | null;
  grade: number;
  maxMark: number;
}

interface PaperResult {
  studentPaperId: number;
  studentCode: string;
  totalGrade: number | null;
  imageUrl: string;
  status: string;
  answers: AnswerResult[];
}

const Results: React.FC = () => {
  const { paperId } = useParams<{ paperId: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<PaperResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Grade editing state
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editGradeValue, setEditGradeValue] = useState('');
  const [savingGrade, setSavingGrade] = useState(false);
  const [gradeMsg, setGradeMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    if (!paperId) return;
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/papers/${paperId}/results`);
        setResult(data);
      } catch {
        setError('Failed to load results. The paper may not be evaluated yet.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [paperId]);

  const startEdit = (answer: AnswerResult) => {
    setEditingAnswerId(answer.answerId);
    setEditGradeValue(String(answer.grade));
    setGradeMsg(null);
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditGradeValue('');
  };

  const saveGrade = async (answerId: number, maxMark: number) => {
    const newGrade = parseFloat(editGradeValue);
    if (isNaN(newGrade) || newGrade < 0 || newGrade > maxMark) {
      setGradeMsg({ type: 'err', text: `Grade must be between 0 and ${maxMark}` });
      return;
    }
    setSavingGrade(true);
    try {
      await api.put(`/answers/${answerId}/grade`, { grade: newGrade });
      // Re-fetch to get updated totalGrade
      const { data } = await api.get(`/papers/${paperId}/results`);
      setResult(data);
      setEditingAnswerId(null);
      setGradeMsg({ type: 'ok', text: 'Grade updated successfully.' });
      setTimeout(() => setGradeMsg(null), 3000);
    } catch (err: any) {
      setGradeMsg({ type: 'err', text: err.response?.data?.title || 'Failed to save grade.' });
    } finally {
      setSavingGrade(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3 text-text-muted font-bold">
        <Loader2 size={28} className="animate-spin text-primary" /> Loading results…
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle size={40} className="text-error" />
        <p className="font-bold text-text-primary">{error || 'No results found.'}</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline flex items-center gap-1">
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const totalMaxMark = result.answers.reduce((sum, a) => sum + a.maxMark, 0);
  const scorePercent = totalMaxMark > 0
    ? Math.round(((result.totalGrade ?? 0) / totalMaxMark) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white shadow-sm border border-border/30 transition-all text-text-muted hover:text-primary"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              Student: <span className="text-primary font-mono">{result.studentCode}</span>
            </h2>
            <p className="text-text-muted text-sm font-medium mt-0.5">
              Evaluation Results · Paper #{result.studentPaperId}
            </p>
          </div>
        </div>

        {/* Score badge */}
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-2xl border border-border/40 shadow-sm px-6 py-3 text-center">
            <p className="text-3xl font-black text-text-primary">
              {result.totalGrade?.toFixed(2) ?? '—'}
              <span className="text-base font-semibold text-text-muted ml-1">/ {totalMaxMark}</span>
            </p>
            <p className="text-xs text-text-muted font-semibold mt-0.5">{scorePercent}% Score</p>
          </div>
        </div>
      </div>

      {/* Grade feedback banner */}
      {gradeMsg && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm border ${
          gradeMsg.type === 'ok'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {gradeMsg.type === 'ok' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {gradeMsg.text}
        </div>
      )}

      {/* Main content: paper image + answers table */}
      <div className="flex flex-col xl:flex-row gap-6">

        {/* Paper image */}
        <div className="xl:w-[340px] flex-shrink-0">
          <div className="bg-white rounded-[2rem] border border-border/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/30 flex items-center gap-2 text-text-primary font-bold text-sm">
              <ImageIcon size={16} className="text-primary" /> Answer Sheet
            </div>
            <div className="p-4">
              {result.imageUrl ? (
                <img
                  src={`${BACKEND_ORIGIN}${result.imageUrl}`}
                  alt={`Paper ${result.studentCode}`}
                  className="w-full rounded-xl shadow-sm border border-border/20"
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-text-muted bg-bg-surface rounded-xl">
                  <FileText size={32} strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answers table */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-[2rem] border border-border/40 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
              <span className="font-bold text-text-primary flex items-center gap-2">
                <FileText size={16} className="text-primary" />
                Question Breakdown
              </span>
              <span className="text-xs text-text-muted font-medium bg-bg-surface px-3 py-1 rounded-full">
                Click ✏️ to edit a grade
              </span>
            </div>

            {result.answers.length === 0 ? (
              <div className="p-12 text-center text-text-muted font-medium">No answers recorded.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-bg-surface text-text-muted text-xs font-bold uppercase tracking-wide">
                      <th className="px-5 py-3 text-left">Q#</th>
                      <th className="px-5 py-3 text-left">Model Answer</th>
                      <th className="px-5 py-3 text-left">Student Answer (OCR)</th>
                      <th className="px-5 py-3 text-center">Grade</th>
                      <th className="px-5 py-3 text-center">Max</th>
                      <th className="px-5 py-3 text-center">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {result.answers.map((ans) => {
                      const isEditing = editingAnswerId === ans.answerId;
                      const pct = ans.maxMark > 0 ? (ans.grade / ans.maxMark) * 100 : 0;
                      const gradeColor = pct >= 70 ? 'text-success' : pct >= 40 ? 'text-warning' : 'text-error';

                      return (
                        <tr key={ans.answerId} className="hover:bg-bg-surface/40 transition-colors">
                          <td className="px-5 py-4">
                            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {ans.questionIndex}
                            </span>
                          </td>
                          <td className="px-5 py-4 max-w-[200px]">
                            <p className="text-xs text-text-secondary font-medium line-clamp-3 leading-relaxed">
                              {ans.modelAnswer || <span className="italic text-text-muted">—</span>}
                            </p>
                          </td>
                          <td className="px-5 py-4 max-w-[200px]">
                            <p className="text-xs text-text-primary font-medium line-clamp-3 leading-relaxed bg-bg-surface/80 rounded-lg p-2">
                              {ans.extractedText || <span className="italic text-text-muted">No OCR text</span>}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                min={0}
                                max={ans.maxMark}
                                step={0.5}
                                value={editGradeValue}
                                onChange={e => setEditGradeValue(e.target.value)}
                                className="w-20 text-center bg-bg-input border border-primary/40 rounded-lg px-2 py-1.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                autoFocus
                              />
                            ) : (
                              <span className={`font-black text-lg ${gradeColor}`}>
                                {ans.grade.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-center text-text-muted font-semibold text-sm">
                            {ans.maxMark}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => saveGrade(ans.answerId, ans.maxMark)}
                                  disabled={savingGrade}
                                  className="p-1.5 rounded-lg text-success hover:bg-success/10 transition-colors"
                                  title="Save grade"
                                >
                                  {savingGrade ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1.5 rounded-lg text-error hover:bg-error/10 transition-colors"
                                  title="Cancel"
                                >
                                  <X size={15} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEdit(ans)}
                                className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Edit grade"
                              >
                                <Edit3 size={15} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-bg-surface font-bold text-sm border-t border-border/40">
                      <td colSpan={3} className="px-5 py-3 text-right text-text-secondary">Total</td>
                      <td className="px-5 py-3 text-center text-text-primary font-black">
                        {result.totalGrade?.toFixed(2) ?? '—'}
                      </td>
                      <td className="px-5 py-3 text-center text-text-muted">{totalMaxMark}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
