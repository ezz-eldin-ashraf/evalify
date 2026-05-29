# Evalify — AI Service

An AI-powered automated grading system for open-ended and essay-style exam answers. Evalify uses OCR and semantic similarity to evaluate handwritten student responses against model answers — delivering fast, consistent, and intelligent grading.

---

## What is Evalify?

Evalify is a graduation project that automates the grading of handwritten exam answers. A teacher provides a model answer and a maximum score; Evalify reads the student's handwritten response using OCR, understands its meaning using AI embeddings, and returns a fair grade.

---

## Features

- Handwritten answer recognition using PaddleOCR (PP-OCRv5)
- Semantic similarity grading using Sentence Transformers
- Two grading modes: **Meaning** (focuses on understanding) and **Strict** (focuses on exact wording)
- Automatic spell correction for OCR output
- REST API ready for frontend and backend integration
- **Unified `/evaluate` endpoint** for direct integration with the .NET backend
- **Model warmup on startup** to eliminate cold start latency on first request
- **GPU acceleration support** via CUDA for faster inference

---

## How It Works

1. The .NET backend sends a cropped answer image (base64) + model answer + max score to `/evaluate`
2. The OCR service extracts the handwritten text from the image using PaddleOCR
3. The extracted text is sent to the ML grading service
4. The ML service compares the text to the model answer using semantic embeddings and TF-IDF
5. A final score is calculated and returned to the .NET backend

---

## Grading Modes

**Meaning Mode** — Rewards answers that convey the correct idea, even if worded differently. Best for conceptual and open-ended questions.

**Strict Mode** — Requires closer alignment in both meaning and specific terminology. Best for definitions and technical questions.

---

## Tech Stack

**AI & ML**
- PaddleOCR (PP-OCRv5) — Handwritten text recognition
- Sentence Transformers (Qwen Embedding Model) — Semantic similarity
- Scikit-learn — TF-IDF keyword similarity
- PySpellChecker — Automatic spell correction for OCR output

---

## Project Structure

```
AI service/
├── ocr_service.py         OCR REST API (port 5001) — includes /ocr and /evaluate endpoints
├── ml_service.py          Grading REST API (port 5002) — includes /grade endpoint
├── ocr_module.py          OCR logic and spell correction
├── grading_module.py      Scoring and similarity logic
├── embedding_module.py    Sentence embedding model loader
├── ocr_requirements.txt   Dependencies for OCR environment
├── ml_requirements.txt    Dependencies for ML environment
└── README.md
```

---

## Requirements

Two separate Python environments are required due to dependency conflicts between PaddlePaddle and PyTorch.

**OCR Environment** — `ocr_env`
- Python 3.11
- PaddlePaddle 3.0, PaddleOCR 3.0.1, PaddleX 3.0.1
- Flask, OpenCV, PySpellChecker, Pillow

**ML Environment** — `ml_env`
- Python 3.11
- PyTorch 2.5.1, Sentence Transformers 5.4.1
- Scikit-learn, Flask

---

## Setup

### 1. Create virtual environments

```bash
py -3.11 -m venv ocr_env
py -3.11 -m venv ml_env
```

### 2. Install dependencies

**OCR environment:**
```bash
ocr_env\Scripts\activate
pip install -r ocr_requirements.txt
```

**ML environment:**
```bash
ml_env\Scripts\activate
pip install -r ml_requirements.txt
```

---

## Running the Services

Start both services before sending any requests. Each requires its own terminal.

**Terminal 1 — OCR Service (port 5001):**
```bash
ocr_env\Scripts\activate
python ocr_service.py
```
Wait for: `OCR model ready.` before sending requests.

**Terminal 2 — ML Service (port 5002):**
```bash
ml_env\Scripts\activate
python ml_service.py
```
Wait for: `ML model ready.` before sending requests.

---

## API Endpoints

### OCR Service (port 5001)

#### `POST /evaluate` ← Main endpoint used by the .NET backend

Request:
```json
{
  "image_base64": "<base64-encoded cropped answer image>",
  "model_answer": "The teacher's reference answer",
  "max_score": 10.0,
  "mode": "meaning"
}
```

Response:
```json
{
  "success": true,
  "grade": 8.5,
  "extracted_text": "text read from the handwriting",
  "tfidf_score": 0.72,
  "embedding_score": 0.88,
  "final_similarity": 0.83,
  "max_score": 10.0,
  "mode": "meaning"
}
```

#### `POST /ocr` ← Internal/testing endpoint

Request:
```json
{
  "image_path": "C:/path/to/image.jpg"
}
```

Response:
```json
{
  "text": "extracted text from image"
}
```

---

### ML Service (port 5002)

#### `POST /grade`

Request:
```json
{
  "model_answer": "reference answer",
  "student_answer": "student's extracted text",
  "max_score": 10.0,
  "mode": "meaning"
}
```

Response:
```json
{
  "tfidf_score": 0.72,
  "embedding_score": 0.88,
  "final_similarity": 0.83,
  "final_score": 8.5,
  "max_score": 10.0,
  "mode": "meaning"
}
```

---

## Integration with .NET Backend

The .NET backend (`Evalify.Infrastructure/Services/AiService.cs`) communicates exclusively with the `/evaluate` endpoint on port 5001.

Configure the base URL in `appsettings.json`:
```json
"AiService": {
  "BaseUrl": "http://localhost:5001"
}
```

---

## Performance Notes

- Both services perform a **model warmup on startup** to eliminate cold start latency
- The ML service runs with `threaded=False` to ensure the GPU-warm main thread handles all requests
- Average response time after warmup: ~2–3 minutes per question on CPU
- GPU acceleration significantly reduces processing time if available

---

## Limitations

- Currently supports English handwritten text only
- Mathematical expressions and equations are not supported
- Performance depends on handwriting clarity and image quality
- Runs on CPU by default; GPU acceleration requires CUDA-compatible hardware

---

## License

This project was developed as a graduation project. All rights reserved.