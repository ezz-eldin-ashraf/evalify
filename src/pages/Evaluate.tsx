import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle, ChevronDown, PlayCircle, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Template {
  templateId: number;
  name: string;
}

interface StudentList {
  id: number;
  name: string;
  studentCount: number;
}

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, listsRes] = await Promise.all([
          api.get('/templates'),
          api.get('/student-lists')
        ]);
        setTemplates(templatesRes.data);
        setStudentLists(listsRes.data);
      } catch (err) {
        setError('Failed to load templates or student lists. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartEvaluation = async () => {
    if (!selectedTemplate || files.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      await api.post(`/templates/${selectedTemplate}/papers`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccessMsg('Papers uploaded successfully! Evaluation is now running in the background.');
      setFiles([]);
      // Redirect to exams/dashboard page after a delay to view processing status
      setTimeout(() => navigate('/exams'), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.title || err.response?.data?.detail || 'Failed to upload papers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canStartEvaluation = selectedTemplate !== '' && files.length > 0;

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Start Evaluation</h2>
          <p className="text-text-muted mt-2 font-medium">Select a mapped template and upload student answer sheets to begin AI grading.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 font-semibold text-sm">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 font-semibold text-sm">
          <CheckCircle size={20} />
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-strong p-8 md:p-12 space-y-10">
        
        {/* Step 1: Select Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
              Select Exam Template
            </h3>
            <div className="relative">
              <select 
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                disabled={isLoading || templates.length === 0}
                className="w-full appearance-none bg-bg-input text-text-primary font-semibold rounded-xl py-4 pl-5 pr-12 border border-transparent focus:border-primary/30 outline-none shadow-sm cursor-pointer transition-all disabled:opacity-50"
              >
                <option value="" disabled>
                  {isLoading ? 'Loading templates...' : templates.length === 0 ? 'No templates found' : 'Choose a mapped template...'}
                </option>
                {templates.map(template => (
                  <option key={template.templateId} value={template.templateId}>{template.name}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
              Select Students List <span className="text-xs font-normal text-text-muted ml-2">(Optional)</span>
            </h3>
            <div className="relative">
              <select 
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                disabled={isLoading || studentLists.length === 0}
                className="w-full appearance-none bg-bg-input text-text-primary font-semibold rounded-xl py-4 pl-5 pr-12 border border-transparent focus:border-primary/30 outline-none shadow-sm cursor-pointer transition-all disabled:opacity-50"
              >
                <option value="">
                  {isLoading ? 'Loading rosters...' : studentLists.length === 0 ? 'No rosters found' : 'Select a student roster...'}
                </option>
                {studentLists.map(list => (
                  <option key={list.id} value={list.id}>{list.name} ({list.studentCount} students)</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Step 2: Upload Student Answers */}
        <div className={`transition-opacity duration-300 ${selectedTemplate === '' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
            Upload Student Papers
          </h3>
          
          <div 
            className={`relative w-full border-2 border-dashed rounded-[2rem] p-12 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[300px]
              ${dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border/60 hover:border-primary/40 hover:bg-bg-surface'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              ref={inputRef}
              type="file" 
              multiple 
              accept="image/*,.pdf" 
              className="hidden" 
              onChange={handleChange}
            />
            
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary shadow-sm">
              <UploadCloud size={40} strokeWidth={2} />
            </div>
            
            <h3 className="text-xl font-bold text-text-primary mb-2">Drag and drop answer sheets here</h3>
            <p className="text-text-muted font-medium mb-8">Files supported: JPG, PNG, PDF (Max 50MB per batch)</p>
            
            <button 
              onClick={() => inputRef.current?.click()}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Select Files
            </button>
          </div>

          {/* File Preview List */}
          {files.length > 0 && (
            <div className="mt-8 animate-fade-in">
              <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                <CheckCircle size={18} className="text-success" />
                {files.length} Files Ready for Evaluation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-bg-surface rounded-xl border border-border/40">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileIcon size={18} className="text-primary flex-shrink-0" />
                      <span className="text-sm font-bold text-text-primary truncate">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-3 ml-2 flex-shrink-0">
                      <span className="text-xs text-text-muted font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      <button 
                        onClick={() => removeFile(index)}
                        className="p-1.5 text-text-muted hover:bg-error/10 hover:text-error rounded-lg transition-colors"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Trigger Evaluation */}
        <div className="pt-6 border-t border-border/40 flex justify-end">
          <button 
            onClick={handleStartEvaluation}
            disabled={!canStartEvaluation || isSubmitting}
            className={`px-10 py-4 rounded-xl font-bold shadow-md transition-all flex items-center gap-3 text-lg
              ${canStartEvaluation && !isSubmitting ? 'bg-primary hover:bg-primary-hover text-white active:scale-[0.98] animate-bounce-subtle' : 'bg-bg-input text-text-muted cursor-not-allowed'}
            `}
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <PlayCircle size={24} />}
            {isSubmitting ? 'Starting...' : 'Start AI Evaluation'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Evaluate;
