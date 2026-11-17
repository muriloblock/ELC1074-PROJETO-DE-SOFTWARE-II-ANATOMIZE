# Anatomize

AI-powered oral examination and assessment platform designed to help medical and health science students prepare for theoretical and practical anatomy evaluations through dynamic speech-to-text workflows, intelligent document chunking, and automated LLM feedback.

---

## Overview

Oral examinations in anatomy and healthcare disciplines demand precise anatomical terminology, spatial reasoning, and clear verbal communication under pressure. Traditional preparation methods rely on static flashcards or mock peer reviews, which rarely provide consistent, objective evaluation or realistic examination conditions.

**Anatomize** bridges this gap by transforming course material (PDFs) into interactive, oral exam simulations. Students upload lecture notes or textbook chapters, select their desired difficulty and question count, and answer questions verbally or via text. An automated AI evaluation pipeline assesses anatomical accuracy, completeness, and clinical terminology, providing immediate qualitative feedback and benchmark model answers.

---

## Key Features

* **Document Ingestion & Semantic Chunking:** Ingests academic PDFs and applies content chunking algorithms to sample sections uniformly, preventing repetitive questions and guaranteeing comprehensive topic coverage.
* **Pluggable LLM Architecture:** Modular backend architecture supporting multiple LLM backends (Groq LLaMA models for low-latency inference or Google Gemini) switchable via environment variables.
* **Oral Assessment & Audio Transcription:** Supports speech-to-text capture so students can verbalize responses, replicating the real-world pressure of oral exam boards.
* **Objective Multi-Criteria Grading:** Evaluates student submissions against verified anatomical criteria, flagging omissions, inaccurate terminology, and partial misconceptions.
* **Model Answer Generation:** Supplies an exemplary benchmark response for each question, reinforcing structured argumentation and precise anatomical references.
* **Interactive Examination Workspace:** Responsive desktop interface featuring a Question Navigation Rail, threaded answer-to-evaluation mappings, and session summary metrics.
* **Authentication & Persistence:** Secure user sessions and assessment histories managed through Supabase.

---

## System Architecture

```
+-------------------------------------------------------------------------+
|                              Frontend Client                            |
|        (React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons)      |
+-------------------------------------------------------------------------+
       |                                                 ^
       | HTTP / REST                                     | State & UI Sync
       v                                                 |
+-------------------------------------------------------------------------+
|                           FastAPI Backend                               |
|        (Python 3.12, Uvicorn, PyPDF Document Processor, Pydantic)       |
+-------------------------------------------------------------------------+
       |                                                 |
       | Semantic Chunks                                 | Transcribed Input
       v                                                 v
+-----------------------------+               +---------------------------+
|      Question Engine        |               |    Evaluation Engine      |
| (Prompt Pipeline & Chunking)|               | (Scoring & Feedback Gen)  |
+-----------------------------+               +---------------------------+
               \                                     /
                v                                   v
+-------------------------------------------------------------------------+
|                         AI Provider Abstraction                         |
|            +-----------------------+   +------------------------+       |
|            |      Groq Cloud       |   |      Google Gemini     |       |
|            |    (LLaMA Models)     |   |       (GenAI SDK)      |       |
|            +-----------------------+   +------------------------+       |
+-------------------------------------------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                         Persistence & Auth                              |
|                   (Supabase PostgreSQL & Storage)                       |
+-------------------------------------------------------------------------+
```

---

## Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Supabase Client, Oxlint
* **Backend:** Python 3.12, FastAPI, Uvicorn, PyPDF, python-multipart, Pydantic
* **AI & NLP:** Groq API, Google GenAI SDK, Prompt Engineering, Semantic Chunking
* **Database & Auth:** Supabase (PostgreSQL, Auth, Object Storage)

---

## Getting Started

### Prerequisites

* Node.js >= 20 and npm >= 10
* Python >= 3.11
* A Supabase project instance
* API Key for Groq or Google Gemini

---

### Backend Setup

1. Navigate to the project root and create a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` in the project root:
   ```bash
   cp .env.example .env
   ```
   Populate the following variables:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   # Optional alternative provider:
   # AI_PROVIDER=gemini
   # GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the FastAPI development server:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   The API will be accessible at `http://localhost:8000` with Swagger documentation available at `http://localhost:8000/docs`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Configure frontend environment variables:
   Copy `frontend/.env.example` to `frontend/.env`:
   ```bash
   cp .env.example .env
   ```
   Configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:5173`.

---

## Project Structure

```
├── backend/
│   ├── routers/          # FastAPI route controllers (questions, evaluation)
│   ├── services/         # Business logic (AI provider abstraction, PDF processing)
│   └── main.py           # FastAPI application entry point and CORS configuration
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components (QuestionRail, Dropzone, EvaluationCard, etc.)
│   │   ├── hooks/        # React custom hooks
│   │   ├── services/     # API integration and Supabase client
│   │   └── App.tsx       # Root layout and exam session workflow
│   └── package.json      # Frontend dependencies and build scripts
├── src/                  # Core AI evaluation and question generation implementations
├── supabase/             # Database migrations and configurations
└── requirements.txt      # Python dependencies
```

---

## Authors & Contributions

Developed as a collaborative software engineering project at the **Universidade Federal de Santa Maria (UFSM)**.

* **Lucas Pairé** — [GitHub](https://github.com/lucasxpaire) • [LinkedIn](https://www.linkedin.com/in/lucaspaire/)
  * Implemented semantic PDF chunking and non-repetitive distribution logic for question generation.
  * Designed and built frontend UX components including the interactive Question Navigation Rail, dynamic answer-to-evaluation grouping, and session synchronization.
  * Backend API integration and state persistence.
* **Murilo Block** — [GitHub](https://github.com/muriloblock)
  * AI engine module implementation, Groq prompt pipelines, and initial project scaffolding.
