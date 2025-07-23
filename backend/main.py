from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
from typing import Optional

from .database import get_db_connection, create_tables
from .preload_data import preload_data

app = FastAPI()

# Initialize database tables and preload data on startup
@app.on_event("startup")
def on_startup():
    create_tables()
    preload_data()

class UserCreate(BaseModel):
    name: str
    year_of_birth: int

class UserLogin(BaseModel):
    name: str
    year_of_birth: int

class UserProgressUpdate(BaseModel):
    user_id: int
    last_lesson: Optional[str] = None
    level: Optional[str] = None
    streak: Optional[int] = None

@app.post("/users/register")
async def register_user(user: UserCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (name, year_of_birth) VALUES (?, ?)",
                       (user.name, user.year_of_birth))
        conn.commit()
        user_id = cursor.lastrowid
        return {"message": "User registered successfully", "user_id": user_id}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User with this name and year of birth already exists")
    finally:
        conn.close()

@app.post("/users/login")
async def login_user(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE name = ? AND year_of_birth = ?",
                   (user.name, user.year_of_birth))
    db_user = cursor.fetchone()
    conn.close()
    if db_user:
        return {"message": "Login successful", "user": dict(db_user)}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/stories/{level}")
async def get_stories_by_level(level: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM stories WHERE level = ?", (level,))
    stories = cursor.fetchall()
    conn.close()
    return {"stories": [dict(story) for story in stories]}

@app.get("/vocabulary/daily")
async def get_daily_vocabulary():
    conn = get_db_connection()
    cursor = conn.cursor()
    # For now, just return a random word. In a real app, you'd have daily logic.
    cursor.execute("SELECT * FROM vocabulary ORDER BY RANDOM() LIMIT 1")
    word = cursor.fetchone()
    conn.close()
    if word:
        return {"word": dict(word)}
    raise HTTPException(status_code=404, detail="No vocabulary words found")

@app.get("/grammar/{level}")
async def get_grammar_exercises_by_level(level: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM grammar_exercises WHERE level = ?", (level,))
    exercises = cursor.fetchall()
    conn.close()
    return {"exercises": [dict(ex) for ex in exercises]}

@app.put("/users/progress")
async def update_user_progress(progress_update: UserProgressUpdate):
    conn = get_db_connection()
    cursor = conn.cursor()
    update_fields = []
    update_values = []

    if progress_update.last_lesson is not None:
        update_fields.append("last_lesson = ?")
        update_values.append(progress_update.last_lesson)
    if progress_update.level is not None:
        update_fields.append("level = ?")
        update_values.append(progress_update.level)
    if progress_update.streak is not None:
        update_fields.append("streak = ?")
        update_values.append(progress_update.streak)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
    update_values.append(progress_update.user_id)

    cursor.execute(query, tuple(update_values))
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    conn.close()
    return {"message": "User progress updated successfully"}
