from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///english_learning.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- Database Models ---

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    birth_year = db.Column(db.Integer, nullable=False)
    progress = db.relationship('UserProgress', backref='user', uselist=False)

class UserProgress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    last_activity = db.Column(db.String(200))
    completed_stories = db.Column(db.String(500), default='[]') # Store as JSON string
    completed_quizzes = db.Column(db.String(500), default='[]') # Store as JSON string
    vocabulary_seen = db.Column(db.String(500), default='[]') # Store as JSON string
    streak = db.Column(db.Integer, default=0)

# --- API Routes ---

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    name = data.get('name')
    birth_year = data.get('birth_year')

    if not name or not birth_year:
        return jsonify({'error': 'Name and birth year are required'}), 400

    user = User.query.filter_by(name=name, birth_year=birth_year).first()
    if not user:
        user = User(name=name, birth_year=birth_year)
        db.session.add(user)
        db.session.commit()

        # Create initial progress for new user
        progress = UserProgress(user_id=user.id)
        db.session.add(progress)
        db.session.commit()

    return jsonify({
        'id': user.id,
        'name': user.name,
        'birth_year': user.birth_year,
        'progress': {
            'last_activity': user.progress.last_activity if user.progress else None,
            'streak': user.progress.streak if user.progress else 0,
            'completed_stories': user.progress.completed_stories if user.progress else '[]',
            'completed_quizzes': user.progress.completed_quizzes if user.progress else '[]',
            'vocabulary_seen': user.progress.vocabulary_seen if user.progress else '[]'
        }
    })

@app.route('/api/user/<int:user_id>/progress', methods=['GET', 'POST'])
def user_progress(user_id):
    user = User.query.get_or_404(user_id)
    progress = user.progress

    if request.method == 'POST':
        data = request.json
        progress.last_activity = data.get('last_activity', progress.last_activity)
        progress.streak = data.get('streak', progress.streak)
        progress.completed_stories = data.get('completed_stories', progress.completed_stories)
        progress.completed_quizzes = data.get('completed_quizzes', progress.completed_quizzes)
        progress.vocabulary_seen = data.get('vocabulary_seen', progress.vocabulary_seen)
        db.session.commit()

    return jsonify({
        'last_activity': progress.last_activity,
        'streak': progress.streak,
        'completed_stories': progress.completed_stories,
        'completed_quizzes': progress.completed_quizzes,
        'vocabulary_seen': progress.vocabulary_seen
    })

# --- Sample Data ---
stories = [
    { "id": 1, "title": "The Lion and the Mouse", "content": "A lion was once sleeping in the forest. A little mouse ran over him and woke him up. The lion was very angry and caught the mouse. The mouse begged for mercy, promising to help the lion one day. The lion laughed but let him go. Later, the lion was caught in a hunter's net. The little mouse gnawed through the ropes and freed the lion. The lion learned that even small friends can be great helpers.", "level": "kid" },
    { "id": 2, "title": "The Tortoise and the Hare", "content": "A hare once boasted about how fast he was. A tortoise challenged him to a race. The hare laughed and accepted. When the race started, the hare ran far ahead and then decided to take a nap. The tortoise, moving slowly but steadily, continued without stopping. When the hare woke up, he saw the tortoise was almost at the finish line. He ran as fast as he could, but it was too late. The tortoise won the race, proving that slow and steady wins the race.", "level": "kid" },
    { "id": 3, "title": "The Boy Who Cried Wolf", "content": "A shepherd boy was bored while watching his flock of sheep. To amuse himself, he cried out, \"Wolf! Wolf!\" The villagers came running to help, but there was no wolf. He did this several times, and each time the villagers came, only to find it was a trick. One day, a real wolf appeared and attacked the sheep. The boy cried \"Wolf! Wolf!\" again, but the villagers thought it was another trick and did not come. The wolf ate many sheep, and the boy learned a valuable lesson about telling the truth.", "level": "teen" }
]

quizzes = [
    { "id": 1, "title": "Present Tense Basics", "level": "kid", "questions": [
        { "q": "I ___ (to be) happy.", "options": ["am", "is", "are"], "answer": "am" },
        { "q": "She ___ (to play) outside.", "options": ["play", "plays", "playing"], "answer": "plays" },
        { "q": "They ___ (to eat) dinner.", "options": ["eat", "eats", "eating"], "answer": "eat" }
    ]},
    { "id": 2, "title": "Past Simple Verbs", "level": "teen", "questions": [
        { "q": "Yesterday, I ___ (to go) to the park.", "options": ["go", "went", "gone"], "answer": "went" },
        { "q": "He ___ (to see) a movie last night.", "options": ["see", "saw", "seen"], "answer": "saw" }
    ]}
]

vocabulary = [
    { "id": 1, "word": "Happy", "meaning": "Feeling or showing pleasure or contentment.", "image": "/images/happy.png", "example": "She was very happy to see her friends." },
    { "id": 2, "word": "Brave", "meaning": "Ready to face and endure danger or pain; showing courage.", "image": "/images/brave.png", "example": "The brave knight fought the dragon." },
    { "id": 3, "word": "Curious", "meaning": "Eager to know or learn something.", "image": "/images/curious.png", "example": "The curious cat explored the new room." }
]

@app.route('/api/stories', methods=['GET'])
def get_stories():
    level = request.args.get('level')
    if level:
        filtered_stories = [s for s in stories if s['level'] == level]
        return jsonify(filtered_stories)
    return jsonify(stories)

@app.route('/api/stories/<int:story_id>', methods=['GET'])
def get_story(story_id):
    story = next((s for s in stories if s['id'] == story_id), None)
    if story:
        return jsonify(story)
    return jsonify({'error': 'Story not found'}), 404

@app.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    level = request.args.get('level')
    if level:
        filtered_quizzes = [q for q in quizzes if q['level'] == level]
        return jsonify(filtered_quizzes)
    return jsonify(quizzes)

@app.route('/api/quizzes/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = next((q for q in quizzes if q['id'] == quiz_id), None)
    if quiz:
        return jsonify(quiz)
    return jsonify({'error': 'Quiz not found'}), 404

@app.route('/api/vocabulary', methods=['GET'])
def get_vocabulary():
    return jsonify(vocabulary)

@app.route('/api/vocabulary/<int:word_id>', methods=['GET'])
def get_word(word_id):
    word = next((w for w in vocabulary if w['id'] == word_id), None)
    if word:
        return jsonify(word)
    return jsonify({'error': 'Word not found'}), 404


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)