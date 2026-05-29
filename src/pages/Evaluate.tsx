import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle, ChevronDown, PlayCircle, Loader2, AlertCircle, Users } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

interface Template { templateId: number; name: string; }
interface StudentList { id: number; name: string; studentCount: number; }

const Evaluate: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [studentLists, setStudentLists] = useState<StudentList[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, listsRes] = await Promise.all([
          api.get('/templates'),
          api.get('/student-lists')
        ]);
        setTemplates(templatesRes.data);
        setStudentLists(listsRes.data);
        const urlTemplateId = searchParams.get('templateId');
        if (urlTemplateId) setSelectedTemplate(urlTemplateId);
      } catch {
        setError('Failed to load templates or student lists. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFiles(p => [...p, ...Array.from(e.dataTransfer.files)]);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFiles(p => [...p, ...Array.from(e.target.files!)]);
  };
  const removeFile = (i: number) => setFiles(p => p.filter((_, idx) => idx !== i));

  const handleStartEvaluation = async () => {
    if (!selectedTemplate || !selectedList || files.length === 0) return;
    setIsSubmitting(true); setError(null); setSuccessMsg(null);
    // Persist roster selection for Reports auto-selection
    localStorage.setItem(`evalify_list_${selectedTemplate}`, selectedList);
    const formData = new FormData();
    files.forEach(f => formData.append('images', f));
    try {
      await api.post(`/templates/${selectedTemplate}/papers`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccessMsg('Papers uploaded! Evaluation is running in the background.');
      setFiles([]);
      setTimeout(() => navigate('/exams'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.title || err.response?.data?.detail || 'Failed to upload papers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canStart = selectedTemplate !== '' && selectedList !== '' && files.length > 0;

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto w-full">
      <div>
        <h2 className="text-3xl font-bold text-text-primary">Start Evaluation</h2>
        <p className="text-text-muted mt-2 font-medium">Select a mapped template and upload student answer sheets to begin AI grading.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 font-semibold text-sm">
          <AlertCircle size={20} />{error}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 font-semibold text-sm">
          <CheckCircle size={20} />{successMsg}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-strong p-8 md:p-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 1. Exam Template */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
              Select Exam Template
            </h3>
            <div className="relative">
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}
                disabled={isLoading || templates.length === 0}
                className="w-full appearance-none bg-bg-input text-text-primary font-semibold rounded-xl py-4 pl-5 pr-12 border border-transparent focus:border-primary/30 outline-none shadow-sm cursor-pointer transition-all disabled:opacity-50">
                <option value="" disabled>{isLoading ? 'Loading…' : templates.length === 0 ? 'No templates found' : 'Choose a mapped template…'}</option>
                {templates.map(t => <option key={t.templateId} value={t.templateId}>{t.name}</option>)}
              </select>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          {/* 2. Student List — REQUIRED */}
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
              Students Roster
              <span className="text-xs font-bold text-error ml-1">* Required</span>
            </h3>
            <div className="relative">
              <Users size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <select value={selectedList} onChange={e => setSelectedList(e.target.value)}
                disabled={isLoading || studentLists.length === 0}
                className={`w-full appearance-none bg-bg-input text-text-primary font-semibold rounded-xl py-4 pl-11 pr-12 border outline-none shadow-sm cursor-pointer transition-all disabled:opacity-50
                  ${selectedList === '' && !isLoading ? 'border-error/40 focus:border-error/60' : 'border-transparent focus:border-primary/30'}`}>
                <option value="">{isLoading ? 'Loading…' : studentLists.length === 0 ? 'No rosters — create one first' : 'Select a student roster…'}</option>
                {studentLists.map(l => <option key={l.id} value={l.id}>{l.name} ({l.studentCount} students)</option>)}
              </select>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
            {!isLoading && selectedList === '' && (
              <p className="mt-2 text-xs font-semibold text-error flex items-center gap-1">
                <AlertCircle size={12} /> A student roster is required to link papers to names.
              </p>
            )}
          </div>
        </div>

        {/* 3. Upload Papers */}
        <div className={`transition-opacity duration-300 ${!selectedTemplate || !selectedList ? 'opacity-40 pointer-events-none' : ''}`}>
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">3</span>
            Upload Student Papers
          </h3>
          <div className={`relative w-full border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]
            ${dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border/60 hover:border-primary/40 hover:bg-bg-surface'}`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <input ref={inputRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleChange} />
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary shadow-sm">
              <UploadCloud size={40} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Drag and drop answer sheets here</h3>
            <p className="text-text-muted font-medium mb-8">Files supported: JPG, PNG, PDF (Max 50MB per batch)</p>
            <button onClick={() => inputRef.current?.click()}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
              Select Files
            </button>
          </div>

          {files.length > 0 && (
            <div className="mt-8 animate-fade-in">
              <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-success" />{files.length} Files Ready
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-bg-surface rounded-xl border border-border/40">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileIcon size={18} className="text-primary flex-shrink-0" />
                      <span className="text-sm font-bold text-text-primary truncate">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <span className="text-xs text-text-muted font-medium">{(file.size/1024/1024).toFixed(2)} MB</span>
                      <button onClick={() => removeFile(i)} className="p-1.5 text-text-muted hover:bg-error/10 hover:text-error rounded-lg transition-colors">
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-border/40 flex justify-end">
          <button onClick={handleStartEvaluation} disabled={!canStart || isSubmitting}
            className={`px-10 py-4 rounded-xl font-bold shadow-md transition-all flex items-center gap-3 text-lg
              ${canStart && !isSubmitting ? 'bg-primary hover:bg-primary-hover text-white active:scale-[0.98]' : 'bg-bg-input text-text-muted cursor-not-allowed'}`}>
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <PlayCircle size={24} />}
            {isSubmitting ? 'Starting…' : 'Start AI Evaluation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Evaluate;
