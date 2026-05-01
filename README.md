# Evalify 🧠✍️
AI-Powered Handwritten Answers Evaluation Platform

---

## 🚀 Overview

Evalify is an intelligent web-based platform designed to automatically evaluate handwritten answers using Artificial Intelligence.

The system combines:
- Optical Character Recognition (OCR)
- Natural Language Processing (NLP)
- Semantic Similarity Models

To transform traditional manual grading into a fast, fair, and scalable automated process.

---

## 🎯 Problem

Manual grading of handwritten answers:
- Time-consuming
- Inconsistent
- Subjective

Existing solutions:
- OCR → extract text only ❌
- NLP → works on typed text only ❌

👉 No complete solution for handwritten semantic evaluation.

---

## 💡 Solution

Evalify provides a full pipeline:

1. Upload handwritten answers
2. Extract text using OCR
3. Analyze meaning using NLP
4. Compare with model answers
5. Generate automated scores
6. Provide feedback & reports

---

## 🏗️ System Architecture

### 🔹 Frontend
- React JS
- Tailwind CSS
- Dashboard-based UI
- Teacher workflows

### 🔹 Backend
- ASP.NET Core (handled by backend developer)
- REST APIs
- Authentication & Authorization

### 🔹 AI Pipeline
- OCR Engine (Handwriting Recognition)
- NLP Models (Sentence Transformers)
- Semantic Similarity Scoring

### 🔹 Database
- SQL Server

---

## 🔄 System Flow

1. Teacher uploads exam template
2. Teacher defines question regions (bounding boxes) that generates coordinates for each
3. Teacher adds model answers & points
        "in details ... the teacher will upload an image of the exam paper and then he will draw boxes around each question or crop regions using Cropper JS library and then he will enter the model answer for this question and points then proceed to crop another question till finishes all questions"
4. Teacher uploads student answers
5. System:
   - Extracts text (OCR)
   - Evaluates answers (NLP)
6. Scores are generated
7. Teacher reviews & adjusts (optional)

---

## ✨ Core Features

- 📝 Handwritten Text Extraction (OCR)
- 🧠 Semantic Evaluation (NLP)
- 📊 Automated Grading System
- 👨‍🏫 Teacher Dashboard
- 🔐 Secure Authentication (JWT)
- 📁 Upload & Manage Answers
- 📈 Results & Reports
- ✏️ Manual Score Adjustment

---

## 👥 User Roles

### Teacher
- Upload templates & answers
- Define questions
- View results
- Adjust scores

### Admin
- Manage users
- Monitor system
- View logs
- Manage backups
