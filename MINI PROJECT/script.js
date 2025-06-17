document.addEventListener('DOMContentLoaded', () => {
    const toggleIngredientsBtn = document.getElementById('toggleIngredients');
    const ingredientsSection = document.getElementById('ingredientsSection');
    const startCookingBtn = document.getElementById('startCooking');
    const nextStepBtn = document.getElementById('nextStep');
    const resetCookingBtn = document.getElementById('resetCooking'); // New button
    const printRecipeBtn = document.getElementById('printRecipe'); // New button
    const stepsList = document.getElementById('stepsList');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText'); // New element
    const cookingTimerDisplay = document.getElementById('cookingTimer'); // Timer display
    const timerSection = document.querySelector('.timer-section'); // Timer section container

    let currentStep = -1; // -1 means cooking hasn't started
    let totalSteps = stepsList.children.length;
    let timerInterval;
    let totalPreparationSeconds = 45 * 60; // Get preparation time from HTML or hardcode as needed
    let remainingTime = totalPreparationSeconds;

    
    function updateProgressBar() {
        if (totalSteps > 0) {
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% Complete`;
        } else {
            progressBar.style.width = '0%';
            progressText.textContent = '0% Complete';
        }
    }

    function highlightCurrentStep() {
        Array.from(stepsList.children).forEach((step, index) => {
            if (index === currentStep) {
                step.classList.add('highlighted');
                step.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                step.classList.remove('highlighted');
            }
        });
        updateProgressBar();
    }

    function startCookingTimer() {
        clearInterval(timerInterval); 
        remainingTime = totalPreparationSeconds;
        timerSection.style.display = 'block'; 
        updateTimerDisplay(); 

        timerInterval = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                cookingTimerDisplay.textContent = "Time's up!";
                timerSection.classList.add('timer-finished'); 
                alert("Preparation time is over! Hope your cake is ready!");
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        cookingTimerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function resetRecipe() {
        clearInterval(timerInterval);
        currentStep = -1;
        Array.from(stepsList.children).forEach(step => step.classList.remove('highlighted'));
        progressBar.style.width = '0%';
        progressText.textContent = '0% Complete';
        nextStepBtn.style.display = 'none';
        resetCookingBtn.style.display = 'none';
        startCookingBtn.textContent = 'Start Cooking';
        startCookingBtn.classList.remove('active-cooking');
        timerSection.style.display = 'none'; 
        remainingTime = totalPreparationSeconds; 
        cookingTimerDisplay.textContent = '00:00'; 
        timerSection.classList.remove('timer-finished');
    }

   

    
    toggleIngredientsBtn.addEventListener('click', () => {
        if (ingredientsSection.classList.contains('collapsed')) {
            ingredientsSection.classList.remove('collapsed');
            ingredientsSection.classList.add('expanded');
            toggleIngredientsBtn.textContent = 'Hide Ingredients';
            toggleIngredientsBtn.classList.add('active'); 
        } else {
            ingredientsSection.classList.remove('expanded');
            ingredientsSection.classList.add('collapsed');
            toggleIngredientsBtn.textContent = 'Show Ingredients';
            toggleIngredientsBtn.classList.remove('active');
        }
    });

    
    startCookingBtn.addEventListener('click', () => {
        if (currentStep === -1) { 
            currentStep = 0;
            highlightCurrentStep();
            nextStepBtn.style.display = 'inline-flex'; 
            resetCookingBtn.style.display = 'inline-flex';
            startCookingBtn.textContent = 'Cooking...';
            startCookingBtn.classList.add('active-cooking');
            startCookingTimer(); 
        } else { 
            resetRecipe();
            
            currentStep = 0;
            highlightCurrentStep();
            nextStepBtn.style.display = 'inline-flex';
            resetCookingBtn.style.display = 'inline-flex';
            startCookingBtn.textContent = 'Cooking...';
            startCookingBtn.classList.add('active-cooking');
            startCookingTimer();
        }
    });

    
    nextStepBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            highlightCurrentStep();
        } else {
            alert('Congratulations! You have completed the recipe! Enjoy your delicious chocolate cake!');
            resetRecipe(); // Reset after completion
        }
    });

   
    resetCookingBtn.addEventListener('click', resetRecipe);

   
    printRecipeBtn.addEventListener('click', () => {
        window.print();
    });

    
    resetRecipe(); // Ensure everything is reset when the page loads
});