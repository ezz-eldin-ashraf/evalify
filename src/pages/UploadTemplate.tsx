import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Settings, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface BoxCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface QuestionData {
  questionNumber: number;
  naturalBox: BoxCoords;
  visualBox: BoxCoords;
  modelAnswer: string;
  score: string;
  gradingMode: string;
}

const UploadTemplate: React.FC = () => {
  // --- Wizard State ---
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 Payload
  const [examName, setExamName] = useState('');
  const [numQuestions, setNumQuestions] = useState<string>('');
  const [examImage, setExamImage] = useState<string | null>(null);
  const [examImageFile, setExamImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Step 2 Payload
  const [currentQ, setCurrentQ] = useState(1);
  const [mappedQuestions, setMappedQuestions] = useState<QuestionData[]>([]);
  
  // Active Question Transient State
  const [box, setBox] = useState<BoxCoords | null>(null);
  const [modelAnswer, setModelAnswer] = useState('');
  const [score, setScore] = useState('');
  const [gradingMode, setGradingMode] = useState('Meaning');

  // Drawing Engine State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setExamImageFile(file);
      const url = URL.createObjectURL(file);
      setExamImage(url);
    }
  };

  const handleStep1Submit = () => {
    if (!examName || !numQuestions || !examImage || parseInt(numQuestions) <= 0) return;
    setStep(2);
  };

  const handleNextQuestion = async () => {
    // Validate active question
    if (!box || box.width === 0 || !modelAnswer || !score) return;

    // Scale coords to backend natural image sizing safely
    let finalBox = { ...box };
    if (imageRef.current) {
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      finalBox = {
        x: Math.round(box.x * scaleX),
        y: Math.round(box.y * scaleY),
        width: Math.round(box.width * scaleX),
        height: Math.round(box.height * scaleY)
      };
    }

    const payload: QuestionData = {
      questionNumber: currentQ,
      naturalBox: finalBox,
      visualBox: { ...box },
      modelAnswer,
      score,
      gradingMode
    };

    // Save to array
    const newMapped = [...mappedQuestions, payload];
    setMappedQuestions(newMapped);

    const totalQ = parseInt(numQuestions);

    if (currentQ < totalQ) {
      // Setup next question loop
      setCurrentQ(prev => prev + 1);
      setBox(null);
      setModelAnswer('');
      setScore('');
      setGradingMode('Meaning');
    } else {
      // Final Submission!
      setIsSubmitting(true);
      try {
        // 1. Upload Template Image
        const formData = new FormData();
        formData.append('name', examName);
        if (examImageFile) {
          formData.append('image', examImageFile);
        }

        const templateRes = await api.post('/templates', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const templateId = templateRes.data.templateId;

        // 2. Map and Upload Questions
        const questionsPayload = newMapped.map(q => ({
          questionIndex: q.questionNumber,
          x: q.naturalBox.x,
          y: q.naturalBox.y,
          width: q.naturalBox.width,
          height: q.naturalBox.height,
          modelAnswer: q.modelAnswer,
          mark: parseFloat(q.score),
          gradingMode: q.gradingMode
        }));

        await api.post(`/templates/${templateId}/questions`, {
          questions: questionsPayload
        });

        alert('Exam Template successfully mapped and saved!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to submit template:', error);
        alert('Failed to save exam template. Please check the console for details.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // --- Drawing Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (step === 1) return; // Prevent drawing in step 1
    if (!containerRef.current || !imageRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setStartPos({ x, y });
    setIsDrawing(true);
    setBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPos || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setBox({
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      width: Math.abs(currentX - startPos.x),
      height: Math.abs(currentY - startPos.y),
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Helper flags
  const totalQ = parseInt(numQuestions) || 0;
  const isStep1Valid = examName.length > 0 && totalQ > 0 && examImage !== null;
  const isStep2Valid = box !== null && box.width > 0 && modelAnswer.length > 0 && score.length > 0;
  const isLastQuestion = currentQ === totalQ;

  return (
    <div className="space-y-8 animate-fade-in-up w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Upload Template</h2>
          <p className="text-text-muted mt-2 font-medium">Map out the evaluation structure for the AI grading engine.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-strong flex flex-col min-h-[600px] overflow-hidden max-w-4xl mx-auto">
        
        {/* Main Column: Form Controls */}
        <div className="w-full p-8 lg:p-12 flex flex-col bg-white">
          
          {/* Step Indicators */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-primary' : 'text-success'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 1 ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                {step > 1 ? <CheckCircle2 size={16} /> : '1'}
              </div>
              <span className="font-bold text-sm">Exam Details</span>
            </div>
            <div className="w-12 h-px bg-border/50"></div>
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-primary' : 'text-text-muted'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 2 ? 'bg-primary/10 text-primary' : 'bg-bg-input text-text-muted'}`}>
                2
              </div>
              <span className="font-bold text-sm">Map Questions</span>
            </div>
          </div>

          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="space-y-6 flex-1 flex flex-col animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Exam Name</label>
                <input 
                  type="text" 
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g., Physics Midterm 101"
                  className="w-full bg-bg-input text-text-primary font-semibold rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Number of Questions</label>
                <input 
                  type="number" 
                  min="1"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  placeholder="e.g., 10"
                  className="w-full bg-bg-input text-text-primary font-semibold rounded-xl py-3.5 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                />
              </div>

              <div className="flex-1 mt-4">
                <label className="block text-sm font-bold text-text-primary mb-2">Upload Blank Template Image</label>
                <div className="bg-bg-surface border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center relative p-8 h-[250px] group">
                  {!examImage ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <UploadCloud size={24} strokeWidth={2.5} />
                      </div>
                      <label className="bg-white border border-border/50 text-text-primary hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold shadow-sm transition-colors cursor-pointer inline-block">
                        Browse Files
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={examImage} alt="Preview" className="max-h-full object-contain rounded-lg shadow-sm" />
                      <label className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm shadow-sm text-text-primary hover:text-primary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors border border-border/50">
                        Change Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleStep1Submit}
                disabled={!isStep1Valid}
                className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 mt-auto
                  ${isStep1Valid ? 'bg-primary hover:bg-primary-hover text-white active:scale-[0.98]' : 'bg-bg-input text-text-muted cursor-not-allowed'}`}
              >
                Next Step: Map Questions
              </button>
            </div>
          )}

          {/* STEP 2: Mapping Loop */}
          {step === 2 && (
            <div className="space-y-6 flex-1 flex flex-col animate-fade-in">
              
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">Mapping Phase</h3>
                  <p className="text-xs text-text-secondary font-medium mt-0.5">Draw bounding box, insert model answer, and assign score.</p>
                </div>
                <div className="bg-white shadow-sm border border-border/40 px-3 py-1.5 rounded-lg font-bold text-sm text-text-primary">
                  Question <span className="text-primary">{currentQ}</span> / {totalQ}
                </div>
              </div>

              {/* Interactive Cropper */}
              <div className="flex-1 min-h-[300px] flex flex-col relative select-none">
                <label className="block text-sm font-bold text-text-primary mb-2">Draw Box for Question {currentQ}</label>
                <div className="flex-1 bg-bg-surface border border-border/60 rounded-2xl flex items-center justify-center overflow-hidden touch-none select-none p-4">
                  <div 
                    ref={containerRef}
                    className="relative inline-block cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <img 
                      ref={imageRef}
                      src={examImage!} 
                      alt="Exam Template" 
                      className="max-w-full max-h-[600px] pointer-events-none select-none block shadow-sm"
                      draggable="false"
                    />
                    {/* Render saved boxes contextually (faded) */}
                    {mappedQuestions.map((mq, idx) => (
                      <div 
                        key={idx}
                        className="absolute border-2 border-success/40 bg-success/10 pointer-events-none flex items-center justify-center"
                        style={{
                          left: `${mq.visualBox.x}px`, top: `${mq.visualBox.y}px`, width: `${mq.visualBox.width}px`, height: `${mq.visualBox.height}px`
                        }}
                      >
                        <span className="text-success font-bold text-xs bg-white/80 px-1 rounded">Q{mq.questionNumber}</span>
                      </div>
                    ))}
                    {/* Current Active Box */}
                    {box && box.width > 0 && box.height > 0 && (
                      <div 
                        className="absolute border-2 border-primary bg-primary/20 pointer-events-none"
                        style={{
                          left: `${box.x}px`, top: `${box.y}px`, width: `${box.width}px`, height: `${box.height}px`
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Data Inputs */}
              <div>
                <label className="block text-sm font-bold text-text-primary mb-2">Model Answer</label>
                <textarea 
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  placeholder={`Enter correct answer for Question ${currentQ}...`}
                  className="w-full h-20 bg-bg-input text-text-primary text-sm font-semibold rounded-xl p-3 border border-transparent focus:border-primary/30 outline-none shadow-sm resize-none transition-all"
                ></textarea>
              </div>

              <div className="flex items-end gap-4">
                <div className="w-1/4">
                  <label className="block text-sm font-bold text-text-primary mb-2">Score</label>
                  <input 
                    type="number" 
                    min="1"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="e.g., 5"
                    className="w-full bg-bg-input text-text-primary font-semibold rounded-xl py-3 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all"
                  />
                </div>
                <div className="w-1/4">
                  <label className="block text-sm font-bold text-text-primary mb-2">Mode</label>
                  <select 
                    value={gradingMode}
                    onChange={(e) => setGradingMode(e.target.value)}
                    className="w-full bg-bg-input text-text-primary font-semibold rounded-xl py-3 px-4 border border-transparent focus:border-primary/30 outline-none shadow-sm transition-all appearance-none"
                  >
                    <option value="Meaning">Meaning</option>
                    <option value="Strict">Strict</option>
                  </select>
                </div>
                <div className="flex-1">
                  <button 
                    onClick={handleNextQuestion}
                    disabled={!isStep2Valid || isSubmitting}
                    className={`w-full py-3 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 h-[48px]
                      ${isStep2Valid ? 'bg-primary hover:bg-primary-hover text-white active:scale-[0.98]' : 'bg-bg-input text-text-muted cursor-not-allowed'}`}
                  >
                    {isSubmitting ? 'Saving...' : (isLastQuestion ? 'Save Exam Payload' : `Next Question (${currentQ + 1})`)}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default UploadTemplate;
