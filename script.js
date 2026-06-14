document.addEventListener('DOMContentLoaded', () => {

    // ===== 10 QUESTIONS =====
    const QUESTIONS = [
        {
            emoji: '💖',
            text: 'Je suis beau sur 10 ?',
            ratingLabels: ['Bof...', 'Pas terrible', 'Moyen', 'Assez bien', 'Bien', 'Plutôt bien', 'Beau !', 'Très beau !', 'Canon !', 'Trop beau 😍'],
        },
        {
            emoji: '🔥',
            text: 'Je suis combien sur 10 au lit ?',
            ratingLabels: ['Euh...', 'Perfectible', 'Moyen', 'Correct', 'Bien', 'Plutôt bien', 'Très bien', 'Super bien !', 'Excellent !', 'Légendaire 😏'],
        },
        {
            emoji: '🍕',
            text: 'Comment sont les dates que je prévois sur 10 ?',
            ratingLabels: ['Raté', 'Bof', 'Moyen', 'Sympa', 'Bien', 'Bien pensé', 'Super bien !', 'Incroyable !', 'Magnifique !', 'Inoubliable 🥹'],
        },
        {
            emoji: '😂',
            text: 'Je suis drôle sur 10 (sois honnête) ?',
            ratingLabels: ['Pas drôle du tout', 'Rarement drôle', 'Parfois drôle', 'Un peu drôle', 'Drôle', 'Assez drôle', 'Très drôle', 'Hilarant !', 'Comique né !', 'Le plus drôle du monde 😂'],
        },
        {
            emoji: '🌹',
            text: 'Je suis romantique sur 10 ?',
            ratingLabels: ['Zéro romantisme', 'Très peu', 'Un peu', 'Parfois', 'Romantique', 'Assez romantique', 'Très romantique', 'Super romantique', 'Incroyablement romantique', 'Prince Charmant 👑'],
        },
        {
            emoji: '🍳',
            text: 'Je cuisine bien sur 10 ?',
            ratingLabels: ['Catastrophique', 'Mauvais', 'Pas terrible', 'Basique', 'Correct', 'Bien', 'Bon cuisinier', 'Très bon !', 'Excellent chef !', 'Top Chef niveau 🌟'],
        },
        {
            emoji: '🧸',
            text: 'Je fais de bons câlins sur 10 ?',
            ratingLabels: ['Trop bizarre', 'Pas doux', 'Moyen', 'Correct', 'Bien', 'Doux', 'Très doux !', 'Câlins magiques !', 'Trop bien !', 'Le meilleur câlineur 🥰'],
        },
        {
            emoji: '👂',
            text: 'Je t\'écoute bien sur 10 ?',
            ratingLabels: ['Jamais', 'Rarement', 'Parfois', 'Un peu', 'Moyen', 'Plutôt bien', 'Bien', 'Très bien', 'Attentif !', 'Toujours présent 💯'],
        },
        {
            emoji: '🌌',
            text: 'Tu te projettes à combien sur 10 avec moi ?',
            ratingLabels: ['Pas du tout', 'Peu', 'Un peu', 'Légèrement', 'Assez', 'Bien', 'Beaucoup', 'Très loin !', 'Super loin !', 'Pour toujours 💫'],
        },
        {
            emoji: '🏆',
            text: 'Au global, je suis le meilleur copain sur 10 ?',
            ratingLabels: ['Euh...', 'Pas trop', 'Moyen', 'Pas mal', 'Bien', 'Très bien', 'Super copain !', 'Excellent copain !', 'Parfait presque', 'LE meilleur copain 🥇'],
        },
    ];

    // Color gradient from red(1) to yellow(5) to green(10)
    const RATING_COLORS = [
        '#ff4d4d', '#ff6b35', '#ff8c00', '#ffb300', '#ffd700',
        '#b8e04a', '#7ec850', '#4caf50', '#2e9e60', '#1db954',
    ];

    // ===== STATE =====
    let currentQuestion = 0;
    let answers = Array(QUESTIONS.length).fill(null).map(() => ({ score: null, comment: '' }));
    let isGoingBack = false;

    // ===== DOM REFS =====
    const screenWelcome  = document.getElementById('screen-welcome');
    const screenQuestion = document.getElementById('screen-question');
    const screenSuccess  = document.getElementById('screen-success');

    const btnStart   = document.getElementById('btn-start');
    const btnPrev    = document.getElementById('btn-prev');
    const btnNext    = document.getElementById('btn-next');
    const btnRestart = document.getElementById('btn-restart');
    const btnEmail   = document.getElementById('btn-send-email');

    const questionCounter  = document.getElementById('question-counter');
    const progressFill     = document.getElementById('progress-bar-fill');
    const questionEmoji    = document.getElementById('question-emoji');
    const questionText     = document.getElementById('question-text');
    const ratingGrid       = document.getElementById('rating-grid');
    const ratingLabel      = document.getElementById('rating-label');
    const commentInput     = document.getElementById('comment-input');
    const resultsSummary   = document.getElementById('results-summary');
    const averageScore     = document.getElementById('average-score');
    const heartsBackground = document.getElementById('hearts-background');

    // ===== FLOATING HEARTS =====
    const heartColors = ['#ff527b','#ff7597','#ff8da9','#ffb3c6','#ffccd5'];

    function createHeart(fast = false) {
        const h = document.createElement('div');
        h.classList.add('floating-heart');
        const size = Math.random() * 22 + 10;
        const dur  = fast ? (Math.random() * 2 + 1.2) : (Math.random() * 8 + 6);
        h.style.width  = `${size}px`;
        h.style.height = `${size}px`;
        h.style.left   = `${Math.random() * 100}%`;
        h.style.animationDuration = `${dur}s`;
        h.style.backgroundColor = heartColors[Math.floor(Math.random() * heartColors.length)];
        heartsBackground.appendChild(h);
        setTimeout(() => h.remove(), dur * 1000);
    }

    for (let i = 0; i < 12; i++) setTimeout(createHeart, Math.random() * 5000);
    setInterval(createHeart, 700);

    function heartsCelebration() {
        const end = Date.now() + 3000;
        const iv = setInterval(() => {
            if (Date.now() > end) return clearInterval(iv);
            createHeart(true);
        }, 70);
    }

    // ===== BUILD RATING BUTTONS =====
    function buildRatingGrid() {
        ratingGrid.innerHTML = '';
        for (let i = 1; i <= 10; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.classList.add('rating-btn');
            btn.textContent = i;
            btn.dataset.value = i;
            btn.setAttribute('id', `rating-btn-${i}`);

            // If this question already has a score selected, restore it
            if (answers[currentQuestion].score === i) {
                btn.classList.add('selected');
                btn.style.background = RATING_COLORS[i - 1];
                btn.style.boxShadow  = `0 6px 20px ${RATING_COLORS[i - 1]}66`;
            }

            btn.addEventListener('click', () => selectRating(i));
            ratingGrid.appendChild(btn);
        }
    }

    function selectRating(value) {
        answers[currentQuestion].score = value;

        // Update all buttons visually
        document.querySelectorAll('.rating-btn').forEach(b => {
            const v = parseInt(b.dataset.value);
            b.classList.remove('selected');
            b.style.background = '';
            b.style.boxShadow  = '';
            if (v === value) {
                b.classList.add('selected');
                b.style.background = RATING_COLORS[value - 1];
                b.style.boxShadow  = `0 6px 24px ${RATING_COLORS[value - 1]}77`;
            }
        });

        // Update label
        const label = QUESTIONS[currentQuestion].ratingLabels[value - 1];
        ratingLabel.textContent = `${value}/10 — ${label}`;
        ratingLabel.style.color = RATING_COLORS[value - 1];

        // Enable Next button
        btnNext.disabled = false;
    }

    // ===== RENDER QUESTION =====
    function renderQuestion(direction = 'right') {
        const q = QUESTIONS[currentQuestion];

        // Animate
        const animClass = direction === 'right' ? 'slide-in-right' : 'slide-in-left';
        const content = document.getElementById('question-content');
        content.classList.remove('slide-in-right', 'slide-in-left');
        void content.offsetWidth; // reflow
        content.classList.add(animClass);

        // Content
        questionEmoji.textContent = q.emoji;
        questionText.textContent  = q.text;
        questionCounter.textContent = `Question ${currentQuestion + 1} / ${QUESTIONS.length}`;
        progressFill.style.width  = `${((currentQuestion + 1) / QUESTIONS.length) * 100}%`;

        // Restore comment
        commentInput.value = answers[currentQuestion].comment || '';

        // Restore label
        const score = answers[currentQuestion].score;
        if (score) {
            ratingLabel.textContent = `${score}/10 — ${q.ratingLabels[score - 1]}`;
            ratingLabel.style.color = RATING_COLORS[score - 1];
        } else {
            ratingLabel.textContent = 'Sélectionne une note ✨';
            ratingLabel.style.color = '';
        }

        // Build buttons
        buildRatingGrid();

        // Nav state
        btnNext.disabled = (answers[currentQuestion].score === null);
        btnPrev.style.visibility = currentQuestion === 0 ? 'hidden' : 'visible';

        // Last question: change Next to "Terminer"
        if (currentQuestion === QUESTIONS.length - 1) {
            btnNext.textContent = 'Terminer ✅';
        } else {
            btnNext.textContent = 'Suivant ➡️';
        }
    }

    // ===== NAVIGATION =====
    btnStart.addEventListener('click', () => {
        screenWelcome.classList.replace('active-screen', 'hide-screen');
        screenQuestion.classList.replace('hide-screen', 'active-screen');
        renderQuestion('right');
    });

    btnNext.addEventListener('click', () => {
        // Save comment
        answers[currentQuestion].comment = commentInput.value.trim();

        if (currentQuestion < QUESTIONS.length - 1) {
            currentQuestion++;
            renderQuestion('right');
        } else {
            // Go to success
            showSuccess();
        }
    });

    btnPrev.addEventListener('click', () => {
        answers[currentQuestion].comment = commentInput.value.trim();
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion('left');
        }
    });

    btnRestart.addEventListener('click', () => {
        currentQuestion = 0;
        answers = Array(QUESTIONS.length).fill(null).map(() => ({ score: null, comment: '' }));

        screenSuccess.classList.replace('active-screen', 'hide-screen');
        screenWelcome.classList.replace('hide-screen', 'active-screen');
    });

    // ===== SUCCESS SCREEN =====
    function showSuccess() {
        screenQuestion.classList.replace('active-screen', 'hide-screen');
        screenSuccess.classList.replace('hide-screen', 'active-screen');

        // Calculate average
        const total = answers.reduce((sum, a) => sum + (a.score || 0), 0);
        const avg   = (total / QUESTIONS.length).toFixed(1);
        averageScore.textContent = `${avg}/10`;

        // Build results list
        resultsSummary.innerHTML = '';
        answers.forEach((a, i) => {
            const item = document.createElement('div');
            item.classList.add('result-item');

            const qText = document.createElement('span');
            qText.classList.add('result-question');
            qText.textContent = `${QUESTIONS[i].emoji} ${QUESTIONS[i].text}`;

            const scoreSpan = document.createElement('span');
            scoreSpan.classList.add('result-score');
            scoreSpan.style.color = RATING_COLORS[(a.score || 1) - 1];
            scoreSpan.textContent = `${a.score || '?'}/10`;

            item.appendChild(qText);
            item.appendChild(scoreSpan);

            if (a.comment) {
                const comment = document.createElement('span');
                comment.classList.add('result-comment');
                comment.textContent = `"${a.comment}"`;
                item.appendChild(comment);
            }

            resultsSummary.appendChild(item);
        });

        // Generate mailto
        const emailAddress = 'gabi.nyons@gmail.com';
        const subject = 'Mes réponses à ton questionnaire de satisfaction 💕';
        let body = `Coucou Gabriel !\n\nVoici mes réponses honnêtes à ton questionnaire de satisfaction :\n\n`;

        answers.forEach((a, i) => {
            body += `${QUESTIONS[i].emoji} ${QUESTIONS[i].text}\n`;
            body += `   Note : ${a.score || '?'}/10`;
            if (a.comment) body += `\n   Commentaire : "${a.comment}"`;
            body += '\n\n';
        });

        body += `━━━━━━━━━━━━━━━━\nMoyenne générale : ${avg}/10\n\n`;
        body += `Je t'aime ❤️`;

        btnEmail.setAttribute('href', `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);

        heartsCelebration();
    }
});
