import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, File, X, CheckCircle } from 'lucide-react';

// Mock parser interface for frontend simulation
interface StudentData {
  id: string;
  name: string;
  code: string;
}

const StudentsList: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<StudentData[]>([]);
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

  const processFile = (file: File) => {
    setExcelFile(file);
    setIsParsing(true);
    
    // Simulate Excel/CSV parsing delay
    setTimeout(() => {
      setParsedData([
        { id: '1', name: 'Ahmed Hassan', code: 'STU-2026-001' },
        { id: '2', name: 'Sarah Mahmoud', code: 'STU-2026-002' },
        { id: '3', name: 'Mohamed Ali', code: 'STU-2026-003' },
        { id: '4', name: 'Nour El-Din', code: 'STU-2026-004' },
        { id: '5', name: 'Youssef Tariq', code: 'STU-2026-005' },
      ]);
      setIsParsing(false);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setExcelFile(null);
    setParsedData([]);
  };

  return (
    <div className="space-y-8 animate-fade-in-up w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Students Lists</h2>
          <p className="text-text-muted mt-2 font-medium">Upload your class roster via Excel or CSV to map identities to graded papers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Upload Zone */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-strong p-8">
            <h3 className="text-lg font-bold text-text-primary mb-6">Upload Roster</h3>
            
            {!excelFile ? (
              <div 
                className={`relative w-full border-2 border-dashed rounded-[1.5rem] p-8 text-center transition-all duration-300 flex flex-col items-center justify-center min-h-[250px]
                  ${dragActive ? 'border-secondary bg-secondary/5 scale-[1.02]' : 'border-border/60 hover:border-secondary/40 hover:bg-bg-surface'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input 
                  ref={inputRef}
                  type="file" 
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                  className="hidden" 
                  onChange={handleChange}
                />
                
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4 text-secondary shadow-sm">
                  <FileSpreadsheet size={32} strokeWidth={2} />
                </div>
                
                <h4 className="text-sm font-bold text-text-primary mb-2">Drag Excel sheet here</h4>
                <p className="text-xs text-text-muted font-medium mb-6">Supported: .xlsx, .csv</p>
                
                <button 
                  onClick={() => inputRef.current?.click()}
                  className="bg-white border-2 border-secondary/20 text-secondary hover:bg-secondary/5 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98]"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="bg-bg-surface border border-border/40 rounded-[1.5rem] p-6 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-success/10 text-success rounded-xl">
                      <File size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-primary truncate max-w-[150px]">{excelFile.name}</p>
                      <p className="text-xs text-text-muted mt-1">{(excelFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeFile}
                    className="p-1.5 text-text-muted hover:bg-error/10 hover:text-error rounded-lg transition-colors"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-border/40">
                  <button 
                    className="w-full bg-secondary hover:bg-secondary-hover text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    disabled={isParsing || parsedData.length === 0}
                  >
                    Save Student Database
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Data Preview Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] shadow-strong overflow-hidden h-full flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-text-primary">Data Preview</h3>
                <p className="text-xs text-text-muted mt-1 font-medium">Verify columns mapped correctly before saving.</p>
              </div>
              {parsedData.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold">
                  <CheckCircle size={14} />
                  {parsedData.length} Students Parsed
                </span>
              )}
            </div>

            <div className="flex-1 overflow-x-auto bg-bg-surface/30">
              {isParsing ? (
                <div className="w-full h-full flex flex-col items-center justify-center py-20">
                  <div className="w-10 h-10 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin mb-4"></div>
                  <p className="text-sm font-bold text-text-secondary animate-pulse">Extracting rows from spreadsheet...</p>
                </div>
              ) : parsedData.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center py-20 opacity-50">
                  <FileSpreadsheet size={48} className="text-text-muted mb-4" strokeWidth={1.5} />
                  <p className="text-sm font-bold text-text-muted">Awaiting Excel Upload</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse animate-fade-in">
                  <thead>
                    <tr className="bg-bg-input/50 text-text-muted text-xs uppercase tracking-wider">
                      <th className="px-8 py-4 font-bold border-b border-border/40">Student Name (Column 1)</th>
                      <th className="px-8 py-4 font-bold border-b border-border/40">Student Code (Column 2)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {parsedData.map((student) => (
                      <tr key={student.id} className="hover:bg-white transition-colors group">
                        <td className="px-8 py-4 text-sm font-bold text-text-primary">{student.name}</td>
                        <td className="px-8 py-4 text-sm font-medium text-text-secondary">
                          <code className="bg-bg-input px-2 py-1 rounded text-primary">{student.code}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentsList;
