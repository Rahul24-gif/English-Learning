document.addEventListener('DOMContentLoaded', () => {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginForm = document.getElementById('login-form');
    const nameInput = document.getElementById('name');
    const dobInput = document.getElementById('dob');
    const greetingElement = document.getElementById('greeting');
    const resumeButton = document.getElementById('resume-button');
    const modulesSection = document.getElementById('modules-section');

    const storyReadingBtn = document.getElementById('story-reading-btn');
    const pronunciationBtn = document.getElementById('pronunciation-btn');
    const grammarBtn = document.getElementById('grammar-btn');
    const vocabularyBtn = document.getElementById('vocabulary-btn');

    const storyReadingScreen = document.getElementById('story-reading-screen');
    const pronunciationScreen = document.getElementById('pronunciation-screen');
    const grammarScreen = document.getElementById('grammar-screen');
    const vocabularyScreen = document.getElementById('vocabulary-screen');

    const backToModulesStoryBtn = document.getElementById('back-to-modules-btn-story');
    const backToModulesPronunciationBtn = document.getElementById('back-to-modules-btn-pronunciation');
    const backToModulesGrammarBtn = document.getElementById('back-to-modules-btn-grammar');
    const backToModulesVocabularyBtn = document.getElementById('back-to-modules-btn-vocabulary');

    // Function to show a screen
    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    }

    const API_BASE_URL = 'http://127.0.0.1:8000';

    async function handleLoginRegister(name, dob) {
        try {
            // Try to log in first
            let response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, year_of_birth: parseInt(dob) }),
            });

            if (!response.ok) {
                // If login fails, try to register
                if (response.status === 401) { // Invalid credentials, likely new user
                    response = await fetch(`${API_BASE_URL}/users/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, year_of_birth: parseInt(dob) }),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.detail || 'Registration failed'}`);
                        return;
                    }
                    alert('New user registered successfully! Please log in again.');
                    // After successful registration, try logging in again
                    response = await fetch(`${API_BASE_URL}/users/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ name, year_of_birth: parseInt(dob) }),
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.detail || 'Login failed after registration'}`);
                        return;
                    }
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail || 'Login failed'}`);
                    return;
                }
            }

            const data = await response.json();
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userName', data.user.name);
            localStorage.setItem('userDob', data.user.year_of_birth);
            localStorage.setItem('userLevel', data.user.level || 'Beginner');
            localStorage.setItem('userStreak', data.user.streak || 0);
            localStorage.setItem('lastLesson', data.user.last_lesson || 'None');

            updateDashboard();
            showScreen(dashboardScreen);

        } catch (error) {
            console.error('Error during login/registration:', error);
            alert('An error occurred. Please try again later.');
        }
    }

    function updateDashboard() {
        const name = localStorage.getItem('userName');
        const dob = localStorage.getItem('userDob');
        const level = localStorage.getItem('userLevel');
        const streak = localStorage.getItem('userStreak');
        const lastLesson = localStorage.getItem('lastLesson');

        const currentYear = new Date().getFullYear();
        const age = currentYear - dob;

        greetingElement.textContent = `Welcome, ${name} (Age: ${age})`;
        document.getElementById('daily-goal').textContent = 'Complete 1 story'; // Placeholder
        document.getElementById('streak').textContent = streak;
        document.getElementById('overall-progress').textContent = '0'; // This would be calculated based on completed lessons/stories
        document.getElementById('last-lesson').textContent = lastLesson;
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput.value;
        const dob = dobInput.value;
        handleLoginRegister(name, dob);
    });

    // Check if user is already logged in (e.g., from a previous session)
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
        updateDashboard();
        showScreen(dashboardScreen);
    } else {
        showScreen(loginScreen);
    }

    // Event Listeners for Navigation
    resumeButton.addEventListener('click', () => showScreen(modulesSection));
    storyReadingBtn.addEventListener('click', () => {
        showScreen(storyReadingScreen);
        loadStory();
    });
    pronunciationBtn.addEventListener('click', () => showScreen(pronunciationScreen));
    grammarBtn.addEventListener('click', () => showScreen(grammarScreen));
    vocabularyBtn.addEventListener('click', () => {
        showScreen(vocabularyScreen);
        loadVocabularyWord();
    });

    backToModulesStoryBtn.addEventListener('click', () => showScreen(modulesSection));
    backToModulesPronunciationBtn.addEventListener('click', () => showScreen(modulesSection));
    backToModulesGrammarBtn.addEventListener('click', () => showScreen(modulesSection));
    backToModulesVocabularyBtn.addEventListener('click', () => showScreen(modulesSection));

    // Story Reading Module Functions
    const storyContentDiv = document.getElementById('story-content');
    const readAloudBtn = document.getElementById('read-aloud-btn');
    const nextStoryBtn = document.getElementById('next-story-btn');
    let currentStory = null;

    async function loadStory() {
        const userLevel = localStorage.getItem('userLevel') || 'Beginner';
        try {
            const response = await fetch(`${API_BASE_URL}/stories/${userLevel}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.stories && data.stories.length > 0) {
                currentStory = data.stories[0]; // For simplicity, just take the first story
                storyContentDiv.innerHTML = `<p>${currentStory.content}</p>`;
            } else {
                storyContentDiv.innerHTML = '<p>No stories available for this level.</p>';
            }
        } catch (error) {
            console.error('Error loading story:', error);
            storyContentDiv.innerHTML = '<p>Failed to load story. Please try again later.</p>';
        }
    }

    readAloudBtn.addEventListener('click', () => {
        if (currentStory && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentStory.content);
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-Speech not supported in your browser.');
        }
    });

    nextStoryBtn.addEventListener('click', () => {
        // Implement logic to get next story, for now just reload a random one
        loadStory();
    });

    // Pronunciation Practice Module Functions
    const targetWordSpan = document.getElementById('target-word');
    const startRecordingBtn = document.getElementById('start-recording-btn');
    const stopRecordingBtn = document.getElementById('stop-recording-btn');
    const pronunciationFeedback = document.getElementById('pronunciation-feedback');
    let recognition;

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const targetWord = targetWordSpan.textContent.trim().toLowerCase();
            const userPronunciation = transcript.trim().toLowerCase();

            if (userPronunciation.includes(targetWord)) {
                pronunciationFeedback.textContent = `Great! You said: "${transcript}".`;
                pronunciationFeedback.style.color = 'green';
            } else {
                pronunciationFeedback.textContent = `Try again. You said: "${transcript}". Target: "${targetWord}"`;
                pronunciationFeedback.style.color = 'red';
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            pronunciationFeedback.textContent = 'Error during recognition. Please try again.';
            pronunciationFeedback.style.color = 'orange';
            startRecordingBtn.disabled = false;
            stopRecordingBtn.disabled = true;
        };

        recognition.onend = () => {
            startRecordingBtn.disabled = false;
            stopRecordingBtn.disabled = true;
        };

    } else {
        startRecordingBtn.disabled = true;
        pronunciationFeedback.textContent = 'Web Speech API not supported in this browser.';
    }

    startRecordingBtn.addEventListener('click', () => {
        targetWordSpan.textContent = 'Hello'; // Placeholder target word
        pronunciationFeedback.textContent = '';
        startRecordingBtn.disabled = true;
        stopRecordingBtn.disabled = false;
        recognition.start();
    });

    stopRecordingBtn.addEventListener('click', () => {
        recognition.stop();
    });

    // Grammar Games Module Functions
    const grammarGameContentDiv = document.getElementById('grammar-game-content');
    const grammarSubmitBtn = document.createElement('button');
    grammarSubmitBtn.textContent = 'Submit Answer';
    grammarSubmitBtn.style.marginTop = '10px';
    grammarSubmitBtn.style.display = 'none'; // Hidden until an exercise is loaded
    grammarGameContentDiv.parentNode.insertBefore(grammarSubmitBtn, grammarGameContentDiv.nextSibling);

    let currentGrammarExercise = null;

    async function loadGrammarExercise() {
        const userLevel = localStorage.getItem('userLevel') || 'Beginner';
        try {
            const response = await fetch(`${API_BASE_URL}/grammar/${userLevel}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.exercises && data.exercises.length > 0) {
                currentGrammarExercise = data.exercises[0]; // For simplicity, take the first exercise
                displayGrammarExercise(currentGrammarExercise);
                grammarSubmitBtn.style.display = 'block';
            } else {
                grammarGameContentDiv.innerHTML = '<p>No grammar exercises available for this level.</p>';
                grammarSubmitBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading grammar exercise:', error);
            grammarGameContentDiv.innerHTML = '<p>Failed to load grammar exercise. Please try again later.</p>';
            grammarSubmitBtn.style.display = 'none';
        }
    }

    function displayGrammarExercise(exercise) {
        grammarGameContentDiv.innerHTML = ''; // Clear previous content
        let contentHTML = '';

        if (exercise.type === 'fill_in_the_blanks') {
            const parts = exercise.question.split('___');
            contentHTML = `<p>${parts[0]}<input type="text" id="grammar-input" placeholder="Type your answer">${parts[1]}</p>`;
        } else if (exercise.type === 'multiple_choice') {
            contentHTML = `<p>${exercise.question}</p>`;
            const options = exercise.options.split('/');
            options.forEach(option => {
                contentHTML += `<label><input type="radio" name="grammar-option" value="${option.trim()}">${option.trim()}</label><br>`;
            });
        } else if (exercise.type === 'drag_and_drop') {
            // Placeholder for drag and drop
            contentHTML = `<p>${exercise.question}</p><p>Drag and drop functionality not yet implemented.</p>`;
        }
        grammarGameContentDiv.innerHTML = contentHTML;
    }

    grammarSubmitBtn.addEventListener('click', () => {
        if (!currentGrammarExercise) return;

        let userAnswer = '';
        if (currentGrammarExercise.type === 'fill_in_the_blanks') {
            userAnswer = document.getElementById('grammar-input').value.trim();
        } else if (currentGrammarExercise.type === 'multiple_choice') {
            const selectedOption = document.querySelector('input[name="grammar-option"]:checked');
            if (selectedOption) {
                userAnswer = selectedOption.value;
            }
        }

        if (userAnswer.toLowerCase() === currentGrammarExercise.answer.toLowerCase()) {
            alert('Correct!');
            // Implement logic to load next exercise or update progress
            loadGrammarExercise(); // Load next exercise for now
        } else {
            alert(`Incorrect. The correct answer was: ${currentGrammarExercise.answer}`);
        }
    });

    grammarBtn.addEventListener('click', () => {
        showScreen(grammarScreen);
        loadGrammarExercise();
    });

    // Vocabulary Builder Module Functions
    const vocabularyWordDiv = document.getElementById('vocabulary-word');
    const vocabularyMeaningDiv = document.getElementById('vocabulary-meaning');
    const vocabularyExampleDiv = document.getElementById('vocabulary-example');
    const vocabularyImage = document.getElementById('vocabulary-image');
    const pronounceWordBtn = document.getElementById('pronounce-word-btn');
    const nextWordBtn = document.getElementById('next-word-btn');
    let currentVocabularyWord = null;

    async function loadVocabularyWord() {
        try {
            const response = await fetch(`${API_BASE_URL}/vocabulary/daily`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.word) {
                currentVocabularyWord = data.word;
                vocabularyWordDiv.textContent = currentVocabularyWord.word;
                vocabularyMeaningDiv.textContent = currentVocabularyWord.meaning;
                vocabularyExampleDiv.textContent = currentVocabularyWord.example_sentence;
                vocabularyImage.src = currentVocabularyWord.image_url || ''; // Use placeholder if no image
            } else {
                vocabularyWordDiv.textContent = 'No vocabulary word available.';
                vocabularyMeaningDiv.textContent = '';
                vocabularyExampleDiv.textContent = '';
                vocabularyImage.src = '';
            }
        } catch (error) {
            console.error('Error loading vocabulary word:', error);
            vocabularyWordDiv.textContent = 'Failed to load vocabulary word.';
        }
    }

    pronounceWordBtn.addEventListener('click', () => {
        if (currentVocabularyWord && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(currentVocabularyWord.word);
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-Speech not supported in your browser.');
        }
    });

    nextWordBtn.addEventListener('click', () => {
        loadVocabularyWord();
    });

    // Theme Switcher
    const themeToggle = document.getElementById('checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.body.classList.add(currentTheme);
        if (currentTheme === 'dark-mode') {
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });
});
