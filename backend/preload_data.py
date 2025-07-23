import sqlite3
import json
from .database import DATABASE_URL, create_tables

def preload_data():
    create_tables() # Ensure tables exist
    conn = sqlite3.connect(DATABASE_URL)
    cursor = conn.cursor()

    # Sample Stories
    stories_data = [
        {"title": "The Little Red Hen", "content": "Once upon a time, there was a little red hen...", "level": "Beginner", "category": "Fairy Tale"},
        {"title": "The Boy Who Cried Wolf", "content": "A shepherd boy was bored...", "level": "Beginner", "category": "Fable"},
        {"title": "The Tortoise and the Hare", "content": "A Hare one day ridiculed the short feet...", "level": "Intermediate", "category": "Fable"},
        {"title": "The Adventures of Sherlock Holmes", "content": "To Sherlock Holmes she is always the woman...", "level": "Advanced", "category": "Mystery"},
    ]

    for story in stories_data:
        try:
            cursor.execute("INSERT INTO stories (title, content, level, category) VALUES (?, ?, ?, ?)",
                           (story["title"], story["content"], story["level"], story["category"]))
        except sqlite3.IntegrityError:
            pass # Story might already exist

    # Sample Vocabulary
    vocabulary_data = [
        {"word": "Ephemeral", "meaning": "lasting for a very short time", "example_sentence": "The ephemeral beauty of a sunset.", "image_url": ""},
        {"word": "Ubiquitous", "meaning": "present, appearing, or found everywhere", "example_sentence": "Coffee shops are ubiquitous in the city.", "image_url": ""},
        {"word": "Serendipity", "meaning": "the occurrence and development of events by chance in a happy or beneficial way", "example_sentence": "A fortunate stroke of serendipity.", "image_url": ""},
    ]

    for vocab in vocabulary_data:
        try:
            cursor.execute("INSERT INTO vocabulary (word, meaning, example_sentence, image_url) VALUES (?, ?, ?, ?)",
                           (vocab["word"], vocab["meaning"], vocab["example_sentence"], vocab["image_url"]))
        except sqlite3.IntegrityError:
            pass # Word might already exist

    # Sample Grammar Exercises
    grammar_data = [
        # Beginner
        {"level": "Beginner", "type": "fill_in_the_blanks", "question": "I ___ a student. (am/is/are)", "options": "am/is/are", "answer": "am"},
        {"level": "Beginner", "type": "multiple_choice", "question": "Which one is a fruit?", "options": "Car, Apple, Book", "answer": "Apple"},
        # Intermediate
        {"level": "Intermediate", "type": "drag_and_drop", "question": "The cat ___ on the mat. (sat/sitting/sits)", "options": "sat/sitting/sits", "answer": "sat"},
        {"level": "Intermediate", "type": "fill_in_the_blanks", "question": "She ___ to the store yesterday. (go/goes/went)", "options": "go/goes/went", "answer": "went"},
        # Advanced
        {"level": "Advanced", "type": "multiple_choice", "question": "Which sentence uses the subjunctive mood correctly?", "options": "If I was a bird, I would fly.; If I were a bird, I would fly.; If I am a bird, I would fly.", "answer": "If I were a bird, I would fly."},
        {"level": "Advanced", "type": "fill_in_the_blanks", "question": "Had I known, I ___ have come. (would/will/can)", "options": "would/will/can", "answer": "would"},
    ]

    for grammar_ex in grammar_data:
        try:
            cursor.execute("INSERT INTO grammar_exercises (level, type, question, options, answer) VALUES (?, ?, ?, ?, ?)",
                           (grammar_ex["level"], grammar_ex["type"], grammar_ex["question"], grammar_ex["options"], grammar_ex["answer"]))
        except sqlite3.IntegrityError:
            pass # Exercise might already exist

    conn.commit()
    conn.close()
    print("Sample data preloaded successfully.")

if __name__ == '__main__':
    preload_data()
