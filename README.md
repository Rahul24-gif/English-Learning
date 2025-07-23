# English Learning Web Application

This project is a fully functional English learning web application built with HTML, CSS, JavaScript (vanilla) for the frontend, and Python with FastAPI for the backend, using SQLite for data storage.

## Core Features:

- **Login & Profile Management:** Simple login with Name and Year of Birth. New users create a profile; returning users restore progress.
- **Dashboard:** Personalized greeting, daily goal, streak counter, overall progress, last completed lesson, and a "Resume" button.
- **Learning Modules:**
    - **Story Reading:** Preloaded short stories categorized by levels, with interactive text highlighting and Text-to-Speech (TTS).
    - **Pronunciation Practice:** Web Speech API for voice input, comparing user pronunciation with target pronunciation.
    - **Grammar Games:** Interactive games like drag-and-drop, fill-in-the-blanks, and multiple-choice quizzes.
    - **Vocabulary Builder:** Daily word with meaning, example sentence, image, and pronunciation.
- **Progress Tracking:** Stores completed stories, quiz scores, streaks, and last visited module. Tracks level progression.
- **UI/UX Design:** Modern, animated design with CSS transitions and Lottie animations. Age-based theme switch (Kids/Adults), Light/Dark mode toggle, smooth page transitions.

## Deliverables:

- Full folder structure: `/frontend` (HTML, CSS, JS), `/backend` (Python API, SQLite DB).
- `README.md` with local setup guide and deployment instructions.
- Clean, modular, well-commented code.

## Local Setup Guide

### Prerequisites

- Python 3.x
- Node.js (for potential frontend build tools, though not strictly required for vanilla JS)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Run the FastAPI application:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will be accessible at `http://127.0.0.1:8000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Open `index.html` in your web browser.**

## Deployment Guide

### Frontend (GitHub Pages)

1.  **Create a GitHub repository** for your project.
2.  **Push your `frontend` directory content** to the `main` branch of your repository.
3.  **Go to your repository settings** on GitHub.
4.  **Navigate to the "Pages" section** under "Code and automation".
5.  **Select the `main` branch** as your GitHub Pages source and click "Save".
6.  Your frontend application will be deployed to `https://<your-username>.github.io/<your-repository-name>/`.

### Backend (Render)

1.  **Create a Render account** and connect your GitHub repository.
2.  **Create a new Web Service** on Render.
3.  **Configure the service:**
    - **Build Command:** `pip install -r requirements.txt`
    - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
    - **Root Directory:** `/backend` (if your backend code is in a subdirectory)
4.  **Deploy the service.** Render will automatically build and deploy your FastAPI application.

