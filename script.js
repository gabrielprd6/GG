document.addEventListener('DOMContentLoaded', () => {
    // ================= DOM ELEMENTS =================
    const screenInvite = document.getElementById('screen-invite');
    const screenPlanner = document.getElementById('screen-planner');
    const screenSuccess = document.getElementById('screen-success');
    
    const plannerStepFood = document.getElementById('planner-step-food');
    const plannerStepMovie = document.getElementById('planner-step-movie');
    
    const indicatorFood = document.getElementById('indicator-food');
    const indicatorMovie = document.getElementById('indicator-movie');
    const progressFill = document.getElementById('progress-fill');
    
    const btnYes = document.getElementById('btn-accept-yes');
    const btnNo = document.getElementById('btn-accept-no');
    
    const btnFoodNext = document.getElementById('btn-food-next');
    const btnMoviePrev = document.getElementById('btn-movie-prev');
    const btnRestart = document.getElementById('btn-restart');
    const btnSendEmail = document.getElementById('btn-send-email');
    
    const movieRadios = document.querySelectorAll('input[name="movie-choice"]');
    const customInputContainer = document.getElementById('custom-input-container');
    const customInputLabel = document.getElementById('custom-input-label');
    const customInputText = document.getElementById('custom-choice-text');
    
    const summaryFood = document.getElementById('summary-food');
    const summaryMovie = document.getElementById('summary-movie');
    const dateForm = document.getElementById('date-config-form');

    // ================= FLOATING HEARTS BACKGROUND =================
    const heartsBackground = document.getElementById('hearts-background');
    const heartColors = ['#ff527b', '#ff7597', '#ff8da9', '#ffb3c6', '#ffccd5'];

    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        const size = Math.random() * 25 + 10; // size between 10px and 35px
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 6;
        const color = heartColors[Math.floor(Math.random() * heartColors.length)];
        
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.left = `${left}%`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.backgroundColor = color;
        
        heartsBackground.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Spawn initial hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(createFloatingHeart, Math.random() * 5000);
    }
    setInterval(createFloatingHeart, 600);

    // ================= THE ESCAPING "NO" BUTTON (SMOOTH SLIDE) =================
    function escapeButton(e) {
        if (e) e.preventDefault();

        // Switch to fixed positioning on first interaction so it can glide anywhere
        if (!btnNo.classList.contains('btn-escape')) {
            const rect = btnNo.getBoundingClientRect();
            // Set current absolute screen positions first to prevent a sudden jump
            btnNo.style.left = `${rect.left}px`;
            btnNo.style.top = `${rect.top}px`;
            btnNo.style.width = `${rect.width}px`;
            btnNo.style.height = `${rect.height}px`;
            btnNo.classList.add('btn-escape');
            
            // Trigger the actual escape motion slightly after class addition
            setTimeout(() => {
                calculateAndMove(e);
            }, 20);
        } else {
            calculateAndMove(e);
        }
    }

    function calculateAndMove(e) {
        const padding = 40;
        const btnWidth = btnNo.offsetWidth;
        const btnHeight = btnNo.offsetHeight;

        // Viewport constraints
        const xMax = window.innerWidth - btnWidth - padding;
        const yMax = window.innerHeight - btnHeight - padding;

        // Find cursor or touch coordinates
        let clientX = 0;
        let clientY = 0;

        if (e && e.clientX !== undefined) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else if (e && e.touches && e.touches[0]) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            const rect = btnNo.getBoundingClientRect();
            clientX = rect.left + btnWidth / 2;
            clientY = rect.top + btnHeight / 2;
        }

        let newX = Math.random() * xMax;
        let newY = Math.random() * yMax;

        // Keep the button at least 150px away from the pointer coordinates
        let attempts = 0;
        while (attempts < 25) {
            const distance = Math.hypot(newX + btnWidth / 2 - clientX, newY + btnHeight / 2 - clientY);
            if (distance > 150) {
                break;
            }
            newX = Math.random() * xMax;
            newY = Math.random() * yMax;
            attempts++;
        }

        // Clamp button within viewport bounds
        newX = Math.max(padding, Math.min(newX, xMax));
        newY = Math.max(padding, Math.min(newY, yMax));

        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
    }

    // Mouse and Touch event listeners for escaping
    btnNo.addEventListener('mouseover', escapeButton);
    btnNo.addEventListener('mouseenter', escapeButton);
    btnNo.addEventListener('touchstart', escapeButton, { passive: false });
    
    // Safety fallback: if clicked, escape instead of triggering default behavior
    btnNo.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        escapeButton(e);
    });

    // ================= SCREEN TRANSITIONS & STEP NAVIGATION =================
    
    // Screen 1 -> Screen 2 (Planner Step 1)
    btnYes.addEventListener('click', () => {
        screenInvite.classList.remove('active-screen');
        screenInvite.classList.add('hide-screen');
        
        screenPlanner.classList.remove('hide-screen');
        screenPlanner.classList.add('active-screen');
        
        // Reset steps progress UI
        plannerStepFood.classList.remove('hide-step');
        plannerStepFood.classList.add('active-step');
        plannerStepMovie.classList.remove('active-step');
        plannerStepMovie.classList.add('hide-step');
        
        indicatorFood.classList.add('active');
        indicatorMovie.classList.remove('active');
        progressFill.style.width = '50%';

        // Restore No button if returning to screen 1 is ever possible
        resetNoButton();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Step 1 -> Step 2
    btnFoodNext.addEventListener('click', () => {
        // Validate if food choice is selected
        const selectedFood = document.querySelector('input[name="food-choice"]:checked');
        if (!selectedFood) {
            // Highlight validation by triggering browser bubble
            const firstRadio = document.querySelector('input[name="food-choice"]');
            if (firstRadio) firstRadio.reportValidity();
            return;
        }

        // Slide/Fade to Step 2
        plannerStepFood.classList.remove('active-step');
        plannerStepFood.classList.add('hide-step');
        
        plannerStepMovie.classList.remove('hide-step');
        plannerStepMovie.classList.add('active-step');
        
        indicatorFood.classList.remove('active');
        indicatorMovie.classList.add('active');
        progressFill.style.width = '100%';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Step 2 -> Step 1
    btnMoviePrev.addEventListener('click', () => {
        plannerStepMovie.classList.remove('active-step');
        plannerStepMovie.classList.add('hide-step');
        
        plannerStepFood.classList.remove('hide-step');
        plannerStepFood.classList.add('active-step');
        
        indicatorFood.classList.add('active');
        indicatorMovie.classList.remove('active');
        progressFill.style.width = '50%';
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function resetNoButton() {
        btnNo.classList.remove('btn-escape');
        btnNo.style.position = '';
        btnNo.style.left = '';
        btnNo.style.top = '';
        btnNo.style.width = '';
        btnNo.style.height = '';
    }

    // ================= DYNAMIC FORM INPUTS =================
    movieRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.id === 'movie-other') {
                customInputLabel.innerText = "Quel film te ferait plaisir ? 🍿";
                customInputText.placeholder = "Ex: La La Land, Shrek...";
                customInputContainer.classList.remove('hide-input');
                customInputText.setAttribute('required', 'true');
                customInputText.focus();
            } else if (radio.id === 'movie-proposal') {
                customInputLabel.innerText = "Quelle est ta proposition ou idée ? 💡";
                customInputText.placeholder = "Ex: Un escape game, aller voir le coucher de soleil...";
                customInputContainer.classList.remove('hide-input');
                customInputText.setAttribute('required', 'true');
                customInputText.focus();
            } else {
                customInputContainer.classList.add('hide-input');
                customInputText.removeAttribute('required');
                customInputText.value = '';
            }
        });
    });

    // ================= FORM SUBMISSION & SUCCESS SCREEN =================
    dateForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get final selections
        const selectedFood = document.querySelector('input[name="food-choice"]:checked');
        const selectedMovie = document.querySelector('input[name="movie-choice"]:checked');

        if (!selectedFood || !selectedMovie) return;

        let foodVal = selectedFood.value;
        let movieVal = selectedMovie.value;

        // Custom movie input logic
        if (selectedMovie.value === 'Autre' || selectedMovie.value === 'Proposition') {
            const customVal = customInputText.value.trim();
            if (customVal) {
                movieVal = customVal;
            } else {
                movieVal = selectedMovie.value === 'Autre' ? "Un film surprise 🎬" : "Une surprise 💡";
            }
        }

        // Format label details with emojis
        if (foodVal === 'Sushi') foodVal = 'Sushis 🍣';
        if (foodVal === 'Tartare de bœuf') foodVal = 'Tartare de bœuf 🥩';
        if (foodVal === 'Pizza') foodVal = 'Pizza 🍕';
        if (foodVal === 'Salade gourmande (tomates & co)') foodVal = 'Salade fraîche 🥗';
        if (foodVal === 'Barbecue') foodVal = 'Barbecue 🔥';

        if (movieVal === 'Star Wars') movieVal = 'Star Wars 🌌';
        if (movieVal === 'Footloose') movieVal = 'Footloose 🕺';
        if (movieVal === 'Le Monde de Nemo') movieVal = 'Le Monde de Nemo 🐠';

        // Update success text
        summaryFood.innerText = foodVal;
        summaryMovie.innerText = movieVal;

        // Configure pre-filled email mailto link
        const emailAddress = 'gabin.nyons@gmail.com';
        const emailSubject = 'Planification de notre date romantique ! ❤️';
        const emailBody = `Coucou !\n\nVoici le programme choisi pour notre date de retrouvailles :\n\n🍴 Plat choisi : ${foodVal}\n🎬 Programme cinéma : ${movieVal}\n\nJ'ai tellement hâte de te retrouver, ça va être incroyable. 🥰`;
        
        const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        btnSendEmail.setAttribute('href', mailtoLink);

        // Trigger confetti rain
        triggerHeartsCelebration();

        // Hide Planner & Show Success
        screenPlanner.classList.remove('active-screen');
        screenPlanner.classList.add('hide-screen');
        
        screenSuccess.classList.remove('hide-screen');
        screenSuccess.classList.add('active-screen');

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ================= RESTART BUTTON =================
    btnRestart.addEventListener('click', () => {
        // Reset form inputs
        dateForm.reset();
        customInputContainer.classList.add('hide-input');
        customInputText.removeAttribute('required');
        
        // Go back to step 1
        screenSuccess.classList.remove('active-screen');
        screenSuccess.classList.add('hide-screen');
        
        screenPlanner.classList.remove('hide-screen');
        screenPlanner.classList.add('active-screen');

        plannerStepFood.classList.remove('hide-step');
        plannerStepFood.classList.add('active-step');
        plannerStepMovie.classList.remove('active-step');
        plannerStepMovie.classList.add('hide-step');
        
        indicatorFood.classList.add('active');
        indicatorMovie.classList.remove('active');
        progressFill.style.width = '50%';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ================= HEARTS CELEBRATION (CONFETTI) =================
    function triggerHeartsCelebration() {
        const duration = 3000;
        const end = Date.now() + duration;

        const interval = setInterval(() => {
            if (Date.now() > end) {
                return clearInterval(interval);
            }

            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            
            const size = Math.random() * 20 + 15;
            const left = Math.random() * 100;
            const color = heartColors[Math.floor(Math.random() * heartColors.length)];
            
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.left = `${left}%`;
            heart.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
            heart.style.backgroundColor = color;
            heart.style.bottom = '-20px';
            
            heartsBackground.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 3500);
        }, 80);
    }
});
