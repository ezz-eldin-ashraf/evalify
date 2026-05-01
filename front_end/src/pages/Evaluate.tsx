import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle, ChevronDown, PlayCircle } from 'lucide-react';

const Evaluate: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const canStartEvaluation = selectedTemplate !== '' && selectedList !== '' && files.length > 0;

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Start Evaluation</h2>
          <p className="text-text-muted mt-2 font-medium">Select a mapped template and upload student answer sheets to begin AI grading.</p>
        </div>
      </div>

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
                className="w-full appearance-none bg-bg-input text-text-primary font-semibold rounded-xl py-4 pl-5 pr-12 border border-transparent focus:border-primary/30 outline-none shadow-sm cursor-pointer transition-all"
              >
                <option value="" disabled>Choose a mapped template...</option>
                <option value="physics-101">Physics Midterm 101 (15 Questions)</option>
                <option value="calculus-final">Calculus Final (10 Questions)</option>
                <option value="data-struct">Data Structures (20 Questions)</option>
              </select>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
              Select Students List
            </h3>
            <div className="relative">
              <select 
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="w-full appearance-none bg-bg-input text-text-primary font-semibold rounded-xl py-4 pl-5 pr-12 border border-transparent focus:border-primary/30 outline-none shadow-sm cursor-pointer transition-all"
              >
                <option value="" disabled>Choose a student roster...</option>
                <option value="cs-2026">CS Cohort 2026 (120 Students)</option>
                <option value="physics-sec-a">Physics Section A (45 Students)</option>
              </select>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Step 2: Upload Student Answers */}
        <div className={`transition-opacity duration-300 ${selectedTemplate === '' || selectedList === '' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
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
                      <File size={18} className="text-primary flex-shrink-0" />
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
            disabled={!canStartEvaluation}
            className={`px-10 py-4 rounded-xl font-bold shadow-md transition-all flex items-center gap-3 text-lg
              ${canStartEvaluation ? 'bg-primary hover:bg-primary-hover text-white active:scale-[0.98] animate-bounce-subtle' : 'bg-bg-input text-text-muted cursor-not-allowed'}
            `}
          >
            <PlayCircle size={24} />
            Start AI Evaluation
          </button>
        </div>

      </div>
    </div>
  );
};

export default Evaluate;
