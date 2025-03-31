// Login and authentication functionality for Financial Literacy App

// DOM Elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const submitButton = document.getElementById('submit-btn');

// Constants
const AUTH_KEYS = {
    IS_LOGGED_IN: 'isLoggedIn',
    USERNAME: 'username',
    USER_EMAIL: 'userEmail',
    LAST_LOGIN: 'lastLogin'
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded, checking authentication status...');
    
    // Check if user is already logged in
    if (localStorage.getItem(AUTH_KEYS.IS_LOGGED_IN)) {
        console.log('User already logged in, redirecting to main app...');
        redirectToMainApp();
        return;
    }
    
    // Setup login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener attached');
    } else {
        console.error('Login form element not found!');
    }
    
    // Setup input validation
    setupInputValidation();
});

/**
 * Set up real-time input validation
 */
function setupInputValidation() {
    const inputs = [usernameInput, emailInput, passwordInput];
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                validateInput(input);
                updateSubmitButton();
            });
        }
    });
}

/**
 * Validate individual input field
 */
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMsg = '';
    
    switch(input.id) {
        case 'username':
            isValid = value.length >= 3;
            errorMsg = 'Username must be at least 3 characters long';
            break;
        case 'email':
            isValid = isValidEmail(value);
            errorMsg = 'Please enter a valid email address';
            break;
        case 'password':
            isValid = value.length >= 6;
            errorMsg = 'Password must be at least 6 characters long';
            break;
    }
    
    // Update input styling
    input.classList.toggle('invalid', !isValid);
    input.classList.toggle('valid', isValid && value.length > 0);
    
    return isValid;
}

/**
 * Update submit button state based on form validity
 */
function updateSubmitButton() {
    if (submitButton) {
        const isFormValid = validateForm();
        submitButton.disabled = !isFormValid;
        submitButton.classList.toggle('disabled', !isFormValid);
    }
}

/**
 * Validate entire form
 */
function validateForm() {
    const usernameValid = validateInput(usernameInput);
    const emailValid = validateInput(emailInput);
    const passwordValid = validateInput(passwordInput);
    
    return usernameValid && emailValid && passwordValid;
}

/**
 * Handle login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    console.log('Login form submitted');
    
    // Disable submit button to prevent double submission
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
    }
    
    // Get and trim values
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Validate form
    if (!validateForm()) {
        console.log('Form validation failed');
        showError('Please fix the errors in the form');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        }
        return;
    }
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Store authentication data
        localStorage.setItem(AUTH_KEYS.IS_LOGGED_IN, 'true');
        localStorage.setItem(AUTH_KEYS.USERNAME, username);
        localStorage.setItem(AUTH_KEYS.USER_EMAIL, email);
        localStorage.setItem(AUTH_KEYS.LAST_LOGIN, new Date().toISOString());
        
        console.log('Login successful, playing success sound...');
        playSuccessSound();
        
        // Redirect to main app
        console.log('Redirecting to main app...');
        redirectToMainApp();
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        }
    }
}

/**
 * Redirect to main app
 */
function redirectToMainApp() {
    try {
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Redirect error:', error);
        showError('Failed to redirect. Please try refreshing the page.');
    }
}

/**
 * Basic email validation using regex
 */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Show error message to user
 */
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.classList.add('shake');
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
            errorMessage.classList.remove('shake');
        }, 3000);
    }
}

/**
 * Play success sound on successful login
 */
function playSuccessSound() {
    if (window.AudioManager) {
        AudioManager.playSound('correct');
    } else {
        console.warn('AudioManager not available for login sound');
    }
}

// Add form styles
const style = document.createElement('style');
style.textContent = `
    .invalid {
        border-color: #ff4444 !important;
        background-color: rgba(255, 68, 68, 0.1);
    }
    
    .valid {
        border-color: #00C851 !important;
        background-color: rgba(0, 200, 81, 0.1);
    }
    
    .disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        50% { transform: translateX(10px); }
        75% { transform: translateX(-10px); }
        100% { transform: translateX(0); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

// Theme toggle functionality
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

// Initialize theme and check login status when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'levels.html';
    }
});

// Form switching functionality
const loginContainer = document.querySelector('.login-container');
const signupContainer = document.getElementById('signupContainer');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const signupErrorMessage = document.getElementById('signupErrorMessage');

showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

// Handle login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Here you would typically validate against a backend
    // For demo purposes, we'll just check if fields are filled
    if (email && password) {
        // Store user data
        const userData = {
            email: email,
            name: email.split('@')[0], // For demo purposes
            totalXP: 0
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('totalXP', '0');
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to levels page
        window.location.href = 'levels.html';
    } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Please fill in all fields';
    }
});

// Handle signup
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Here you would typically validate against a backend
    // For demo purposes, we'll just check if fields are filled
    if (name && email && password) {
        // Store user data
        const userData = {
            name: name,
            email: email,
            totalXP: 0
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('totalXP', '0');
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirect to levels page
        window.location.href = 'levels.html';
    } else {
        signupErrorMessage.style.display = 'block';
        signupErrorMessage.textContent = 'Please fill in all fields';
    }
}); 