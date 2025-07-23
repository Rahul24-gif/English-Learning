# English Learning App

This is a full-stack web application for learning English, designed for users of all age groups (kids, teens, adults). It features user management, interactive learning modules, and progress tracking.

## Features

*   **Login & User Management:** Simple login with Name & Year of Birth. User profiles and progress are stored in an SQLite database.
*   **Dashboard:** Personalized welcome message, daily learning goal, last completed activity, progress percentage, and a "Resume" button.
*   **Learning Modules:**
    *   **Story Reading:** Interactive stories with text-to-speech and highlighted text.
    *   **Pronunciation Practice:** Uses Web Speech API for speech recognition and feedback.
    *   **Grammar Games:** Quizzes, drag-and-drop activities, and fill-in-the-blank exercises.
    *   **Vocabulary Builder:** Daily word with meaning, image, pronunciation, and example usage.
*   **Progress Tracking:** Saves completed modules, quiz scores, and last visited sections. Displays streaks and progress stats.
*   **UI/UX:** Fully responsive and mobile-friendly. Age-based themes (colorful for kids, clean for teens/adults). Light/Dark mode toggle.
*   **Other Features:** Daily streak counter, learning goals, and motivational notifications.

## Technical Stack

*   **Frontend:** React.js
*   **Backend:** Flask (Python) with REST API
*   **Database:** SQLite
*   **APIs:** Google Text-to-Speech (or browser's native TTS), Web Speech API

## Project Structure

```
english-learning-app/
├── backend/
│   ├── app.py
│   ├── english_learning.db (generated after first run)
│   └── requirements.txt
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.js
    │   │   ├── GrammarGames.js
    │   │   ├── Login.js
    │   │   ├── PronunciationPractice.js
    │   │   ├── StoryReading.js
    │   │   └── VocabularyBuilder.js
    │   ├── App.css
    │   ├── App.js
    │   ├── index.css
    │   ├── index.js
    │   └── KidTheme.css
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    └── README.md (frontend specific)
```

## Setup and Local Deployment

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

```bash
git clone <repository_url>
cd english-learning-app/vanilla # Or wherever your project root is
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Create a Python virtual environment and activate it:

```bash
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

Run the Flask application:

```bash
python app.py
```

The backend server will start on `http://localhost:5001`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd ../frontend
```

Install the Node.js dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm start
```

The frontend application will open in your browser, usually on `http://localhost:3000`.

## Deployment

### Backend (Render)

1.  **Create a Render Account:** If you don't have one, sign up at [Render](https://render.com/).
2.  **Connect to GitHub:** Connect your GitHub repository to Render.
3.  **New Web Service:** Create a new web service.
4.  **Configuration:**
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `python app.py`
    *   **Environment Variables:** You might need to set `PYTHON_VERSION` to `3.9.x` or higher.
    *   **Database:** Render can host SQLite, but for production, consider a more robust database like PostgreSQL (Render offers managed PostgreSQL). For this project's SQLite, it will work, but data might be ephemeral on free tiers.
5.  **Deploy:** Click "Create Web Service" and Render will build and deploy your Flask app.

### Frontend (Vercel)

1.  **Create a Vercel Account:** If you don't have one, sign up at [Vercel](https://vercel.com/).
2.  **Connect to GitHub:** Connect your GitHub repository to Vercel.
3.  **New Project:** Import your `frontend` directory as a new project.
4.  **Configuration:** Vercel usually auto-detects React apps.
    *   **Build Command:** `npm run build` (usually auto-detected)
    *   **Output Directory:** `build` (usually auto-detected)
    *   **Environment Variables:** You will need to set an environment variable for your backend API URL. For example:
        `REACT_APP_API_URL = <your_render_backend_url>`
        You'll need to update your frontend `axios` calls to use this environment variable instead of `http://localhost:5001`.
5.  **Deploy:** Click "Deploy" and Vercel will build and deploy your React app.

## Sample Data

The `backend/app.py` file contains inline sample JSON data for stories, quizzes, and vocabulary. For a production application, this data would typically be managed through a more robust content management system or loaded from external files/APIs.

## Future Enhancements

*   More sophisticated progress tracking and analytics.
*   User authentication with passwords and secure hashing.
*   Integration with external APIs for richer content (e.g., advanced dictionary, real-time news).
*   More diverse grammar game types (e.g., drag-and-drop, fill-in-the-blanks).
*   User-generated content or community features.
*   Improved UI/UX animations and transitions.
*   Dedicated admin panel for content management.
