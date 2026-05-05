import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileSpreadsheet, File, X, CheckCircle, AlertCircle, Loader2, ArrowLeft, Plus, Users, Edit2, Trash2, Save, XCircle } from 'lucide-react';
import api from '../api/axios';

interface StudentListType {
  id: number;
  name: string;
  studentCount: number;
  createdAt: string;
}

interface StudentData {
  id: number;
  name: string;
  code: string;
}

const StudentsList: React.FC = () => {
  const [view, setView] = useState<'lists' | 'roster'>('lists');
  const [studentLists, setStudentLists] = useState<StudentListType[]>([]);
  const [selectedList, setSelectedList] = useState<StudentListType | null>(null);
  
  // States for lists view
  const [newListName, setNewListName] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [listsLoading, setListsLoading] = useState(true);

  // States for roster view
  const [dragActive, setDragActive] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<StudentData[]>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // List rename state
  const [renamingListId, setRenamingListId] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [isSavingRename, setIsSavingRename] = useState(false);

  // Inline editing states
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Manual Add state
  const [isAdding, setIsAdding] = useState(false);
  const [addName, setAddName] = useState('');
  const [addCode, setAddCode] = useState('');
  const [isSavingAdd, setIsSavingAdd] = useState(false);

  useEffect(() => {
    fetchStudentLists();
  }, []);

  const fetchStudentLists = async () => {
    setListsLoading(true);
    try {
      const res = await api.get('/student-lists');
      setStudentLists(res.data);
    } catch (err) {
      console.error('Failed to load student lists', err);
    } finally {
      setListsLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) return;
    setIsCreatingList(true);
    setError(null);
    try {
      const res = await api.post('/student-lists', { name: newListName });
      const newList: StudentListType = res.data;
      setStudentLists(prev => [newList, ...prev]);
      setNewListName('');
      // Auto-open the newly created list
      await openRoster(newList);
    } catch (err: any) {
      console.error(err);
      setError('Failed to create list.');
    } finally {
      setIsCreatingList(false);
    }
  };

  const startRename = (e: React.MouseEvent, list: StudentListType) => {
    e.stopPropagation(); // prevent opening the roster
    setRenamingListId(list.id);
    setRenameValue(list.name);
  };

  const saveRename = async (e: React.MouseEvent, listId: number) => {
    e.stopPropagation();
    if (!renameValue.trim()) return;
    setIsSavingRename(true);
    try {
      const res = await api.put(`/student-lists/${listId}`, { name: renameValue });
      setStudentLists(prev => prev.map(l => l.id === listId ? { ...l, name: res.data.name } : l));
      setRenamingListId(null);
    } catch (err) {
      setError('Failed to rename list.');
    } finally {
      setIsSavingRename(false);
    }
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingListId(null);
    setRenameValue('');
  };

  const openRoster = async (list: StudentListType) => {
    setSelectedList(list);
    setView('roster');
    setError(null);
    setSuccessMsg(null);
    setExcelFile(null);
    await fetchRoster(list.id);
  };

  const fetchRoster = async (listId: number) => {
    setRosterLoading(true);
    try {
      const res = await api.get(`/student-lists/${listId}/students`);
      const mappedData = res.data.map((s: any) => ({
        id: s.id,
        name: s.fullName || s.name,
        code: s.studentCode || s.code,
      }));
      setParsedData(mappedData);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setRosterLoading(false);
    }
  };

  const goBackToLists = () => {
    setView('lists');
    setSelectedList(null);
    setParsedData([]);
    setError(null);
    setSuccessMsg(null);
    fetchStudentLists(); // Refresh counts
  };

  const processFile = (file: File) => {
    setExcelFile(file);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSaveToBackend = async () => {
    if (!excelFile || !selectedList) return;
    
    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', excelFile);

      const res = await api.post(`/student-lists/${selectedList.id}/students/roster`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMsg(`Successfully imported ${res.data?.insertedCount || res.data?.parsedCount || 'all'} students!`);
      setExcelFile(null);
      await fetchRoster(selectedList.id);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.title || err.response?.data?.detail || 'Failed to upload roster.');
    } finally {
      setIsUploading(false);
    }
  };

  // --- Inline Edit Logic ---
  const startEdit = (student: StudentData) => {
    setEditingStudentId(student.id);
    setEditName(student.name);
    setEditCode(student.code);
  };

  const cancelEdit = () => {
    setEditingStudentId(null);
    setEditName('');
    setEditCode('');
  };

  const saveEdit = async (studentId: number) => {
    if (!selectedList || !editName.trim() || !editCode.trim()) return;
    setIsSavingEdit(true);
    try {
      await api.put(`/student-lists/${selectedList.id}/students/${studentId}`, {
        studentCode: editCode,
        fullName: editName
      });
      await fetchRoster(selectedList.id);
      setEditingStudentId(null);
      setSuccessMsg("Student updated successfully.");
    } catch (err: any) {
      setError(err.response?.data?.title || err.response?.data?.detail || "Failed to update student.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // --- Delete Logic ---
  const deleteStudent = async (studentId: number) => {
    if (!selectedList) return;
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/student-lists/${selectedList.id}/students/${studentId}`);
      await fetchRoster(selectedList.id);
      setSuccessMsg("Student deleted.");
    } catch (err) {
      setError("Failed to delete student.");
    }
  };

  // --- Manual Add Logic ---
  const handleAddStudent = async () => {
    if (!selectedList || !addName.trim() || !addCode.trim()) return;
    setIsSavingAdd(true);
    try {
      await api.post(`/student-lists/${selectedList.id}/students`, {
        studentCode: addCode,
        fullName: addName
      });
      await fetchRoster(selectedList.id);
      setIsAdding(false);
      setAddName('');
      setAddCode('');
      setSuccessMsg("Student added successfully.");
    } catch (err: any) {
      setError(err.response?.data?.title || err.response?.data?.detail || "Failed to add student.");
    } finally {
      setIsSavingAdd(false);
    }
  };

  // --- Drag/Drop Handlers ---
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up w-full">
      
      {/* Feedback Messages */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-5 py-4 font-semibold text-sm">
          <CheckCircle size={20} />
          {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 font-semibold text-sm">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* VIEW: LISTS */}
      {view === 'lists' && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-text-primary">Student Lists</h2>
              <p className="text-text-muted mt-2 font-medium">Manage your class rosters to map identities to graded papers.</p>
            </div>
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-border/40">
              <input 
                type="text" 
                placeholder="e.g. CS101 - Fall 2026"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="bg-bg-input px-4 py-2 rounded-lg text-sm font-semibold outline-none focus:border-primary border border-transparent transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
              />
              <button 
                onClick={handleCreateList}
                disabled={isCreatingList || !newListName.trim()}
                className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                {isCreatingList ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={3} />}
                Create List
              </button>
            </div>
          </div>

          {listsLoading ? (
             <div className="w-full flex justify-center py-20 text-text-muted">
                <Loader2 size={40} className="animate-spin text-secondary" />
             </div>
          ) : studentLists.length === 0 ? (
            <div className="bg-white rounded-[2rem] shadow-strong flex flex-col items-center justify-center py-24 text-center border border-border/40">
              <Users size={64} className="text-border mb-6" />
              <h3 className="text-xl font-bold text-text-primary mb-2">No Student Lists Yet</h3>
              <p className="text-text-muted font-medium max-w-md">Create your first student list above. Once created, you can upload Excel or CSV rosters to easily identify students.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentLists.map(list => (
                <div 
                  key={list.id} 
                  onClick={() => renamingListId !== list.id && openRoster(list)}
                  className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-border/60 hover:shadow-strong hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                      <Users size={24} />
                    </div>
                    <span className="text-xs font-bold text-text-muted bg-bg-surface px-3 py-1 rounded-full">
                      {new Date(list.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {renamingListId === list.id ? (
                    <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                      <input
                        autoFocus
                        type="text"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveRename(e as any, list.id); if (e.key === 'Escape') cancelRename(e as any); }}
                        className="flex-1 bg-bg-input border border-primary/40 rounded-lg px-3 py-1.5 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <button onClick={e => saveRename(e, list.id)} disabled={isSavingRename} className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors">
                        {isSavingRename ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      </button>
                      <button onClick={cancelRename} className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors">
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors truncate">{list.name}</h3>
                      <button
                        onClick={e => startRename(e, list)}
                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                        title="Rename list"
                      >
                        <Edit2 size={15} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}

                  <p className="text-sm font-medium text-text-secondary mt-1">{list.studentCount} Students</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* VIEW: ROSTER */}
      {view === 'roster' && selectedList && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button 
                onClick={goBackToLists}
                className="flex items-center gap-2 text-text-secondary hover:text-primary font-bold text-sm mb-4 transition-colors"
              >
                <ArrowLeft size={16} strokeWidth={3} /> Back to Lists
              </button>
              <h2 className="text-3xl font-bold text-text-primary">{selectedList.name}</h2>
              <p className="text-text-muted mt-2 font-medium">Manage students for this specific roster.</p>
            </div>
            
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
            >
              {isAdding ? <X size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
              {isAdding ? 'Cancel Manual Add' : 'Add Student Manually'}
            </button>
          </div>

          {/* Manual Add Inline Form */}
          {isAdding && (
            <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-secondary/30 flex flex-wrap items-center gap-4 animate-fade-in">
              <input 
                type="text" 
                placeholder="Student Name"
                value={addName}
                onChange={e => setAddName(e.target.value)}
                className="flex-1 min-w-[200px] bg-bg-input px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:border-secondary border border-transparent transition-colors"
              />
              <input 
                type="text" 
                placeholder="Student Code"
                value={addCode}
                onChange={e => setAddCode(e.target.value)}
                className="flex-1 min-w-[200px] bg-bg-input px-4 py-2.5 rounded-xl text-sm font-semibold outline-none focus:border-secondary border border-transparent transition-colors"
              />
              <button 
                onClick={handleAddStudent}
                disabled={isSavingAdd || !addName.trim() || !addCode.trim()}
                className="bg-secondary hover:bg-secondary-hover disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
              >
                {isSavingAdd ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                Save Student
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Upload Zone */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-[2rem] shadow-strong p-8">
                <h3 className="text-lg font-bold text-text-primary mb-6">Upload Bulk Roster</h3>
                
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
                        onClick={() => setExcelFile(null)}
                        className="p-1.5 text-text-muted hover:bg-error/10 hover:text-error rounded-lg transition-colors"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/40">
                      <button 
                        onClick={handleSaveToBackend}
                        disabled={isUploading}
                        className="w-full bg-secondary hover:bg-secondary-hover disabled:opacity-60 text-white py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          'Save Student Database'
                        )}
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
                    <h3 className="text-lg font-bold text-text-primary">Current Enrolled Students</h3>
                    <p className="text-xs text-text-muted mt-1 font-medium">Verify or edit mapped identities.</p>
                  </div>
                  {parsedData.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      <Users size={14} />
                      {parsedData.length} Total
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-x-auto bg-bg-surface/30">
                  {rosterLoading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center py-20 text-text-muted">
                      <Loader2 size={32} className="animate-spin mb-4 text-secondary" />
                      <p className="text-sm font-bold">Loading students...</p>
                    </div>
                  ) : parsedData.length === 0 ? (
                    <div className="w-full h-full flex flex-col items-center justify-center py-20 opacity-50">
                      <FileSpreadsheet size={48} className="text-text-muted mb-4" strokeWidth={1.5} />
                      <p className="text-sm font-bold text-text-muted">List is empty. Upload an Excel file or add manually.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse animate-fade-in">
                      <thead>
                        <tr className="bg-bg-input/50 text-text-muted text-xs uppercase tracking-wider">
                          <th className="px-8 py-4 font-bold border-b border-border/40">Student Name</th>
                          <th className="px-8 py-4 font-bold border-b border-border/40">Student Code</th>
                          <th className="px-8 py-4 font-bold border-b border-border/40 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                        {parsedData.map((student) => {
                          const isEditing = editingStudentId === student.id;
                          return (
                            <tr key={student.id} className="hover:bg-white transition-colors group">
                              <td className="px-8 py-3 w-2/5">
                                {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full bg-white border border-primary/40 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                ) : (
                                  <span className="text-sm font-bold text-text-primary">{student.name}</span>
                                )}
                              </td>
                              <td className="px-8 py-3 w-2/5">
                                {isEditing ? (
                                  <input 
                                    type="text" 
                                    value={editCode} 
                                    onChange={(e) => setEditCode(e.target.value)}
                                    className="w-full bg-white border border-primary/40 rounded-lg px-3 py-1.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                                  />
                                ) : (
                                  <code className="bg-bg-input px-2 py-1 rounded text-primary font-medium text-sm">{student.code}</code>
                                )}
                              </td>
                              <td className="px-8 py-3 text-right">
                                {isEditing ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => saveEdit(student.id)} 
                                      disabled={isSavingEdit}
                                      className="p-1.5 text-success hover:bg-success/10 rounded-lg transition-colors"
                                    >
                                      {isSavingEdit ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={2.5} />}
                                    </button>
                                    <button 
                                      onClick={cancelEdit} 
                                      className="p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors"
                                    >
                                      <XCircle size={16} strokeWidth={2.5} />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => startEdit(student)}
                                      className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                      <Edit2 size={16} strokeWidth={2.5} />
                                    </button>
                                    <button 
                                      onClick={() => deleteStudent(student.id)}
                                      className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default StudentsList;
