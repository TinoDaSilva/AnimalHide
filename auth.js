// Authentication System for South African Hide Sourcing Agent
class AuthenticationSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('signup')) return 'signup';
        if (path.includes('login')) return 'login';
        return 'main';
    }

    init() {
        if (this.currentPage === 'login') {
            this.initLoginPage();
        } else if (this.currentPage === 'signup') {
            this.initSignupPage();
        } else {
            this.checkAuthentication();
        }
    }

    initLoginPage() {
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Check if we have auto-fill data from signup redirect
        this.autoFillFromSignup();
    }

    initSignupPage() {
        const signupForm = document.getElementById('signupFormElement');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Check if we have auto-fill data from login redirect
        this.autoFillFromLogin();
    }

    checkAuthentication() {
        // Check if user is authenticated
        const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
        const userEmail = sessionStorage.getItem('userEmail');
        
        if (!isAuthenticated || !userEmail) {
            // Redirect to login page
            window.location.href = 'login.html';
            return;
        }

        // User is authenticated, continue with normal app functionality
        this.initializeMainApp();
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Check if user exists
        const user = this.users.find(u => u.email === email);
        
        if (!user) {
            // User doesn't exist, redirect to signup with auto-fill
            this.redirectToSignupWithData(email, password);
            return;
        }

        // Check password
        if (user.password === password) {
            // Login successful
            sessionStorage.setItem('authenticated', 'true');
            sessionStorage.setItem('userEmail', email);
            sessionStorage.setItem('userName', user.name);
            
            // Redirect to main app
            window.location.href = 'index.html';
        } else {
            this.showError('Invalid password. Please try again.');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const surname = document.getElementById('signupSurname').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        // Validate form
        if (password !== confirmPassword) {
            this.showError('Passwords do not match. Please try again.');
            return;
        }

        if (password.length < 6) {
            this.showError('Password must be at least 6 characters long.');
            return;
        }

        // Check if user already exists
        if (this.users.find(u => u.email === email)) {
            this.showError('An account with this email already exists. Please login instead.');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            surname: surname,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        // Show success message and redirect to login
        this.showSuccess();
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    redirectToSignupWithData(email, password) {
        // Store the data to auto-fill in signup form
        sessionStorage.setItem('signupAutoFill', JSON.stringify({
            email: email,
            password: password
        }));
        
        // Redirect to signup page
        window.location.href = 'signup.html';
    }

    autoFillFromSignup() {
        const autoFillData = sessionStorage.getItem('signupAutoFill');
        if (autoFillData) {
            try {
                const data = JSON.parse(autoFillData);
                
                // Auto-fill the login form
                document.getElementById('loginEmail').value = data.email || '';
                document.getElementById('loginPassword').value = data.password || '';
                
                // Clear the auto-fill data
                sessionStorage.removeItem('signupAutoFill');
            } catch (error) {
                console.error('Error parsing auto-fill data:', error);
            }
        }
    }

    autoFillFromLogin() {
        const autoFillData = sessionStorage.getItem('signupAutoFill');
        if (autoFillData) {
            try {
                const data = JSON.parse(autoFillData);
                
                // Auto-fill the signup form
                document.getElementById('signupEmail').value = data.email || '';
                document.getElementById('signupPassword').value = data.password || '';
                document.getElementById('signupConfirmPassword').value = data.password || '';
                
                // Clear the auto-fill data
                sessionStorage.removeItem('signupAutoFill');
                
                // Show message that user doesn't have an account
                this.showError('You do not have an account. Please create one below.');
            } catch (error) {
                console.error('Error parsing auto-fill data:', error);
            }
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
            
            // Hide error after 5 seconds
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 5000);
        }
    }

    showSuccess() {
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.classList.remove('hidden');
        }
    }

    loadUsers() {
        const stored = localStorage.getItem('sahideUsers');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Error loading users:', error);
                return [];
            }
        }
        return [];
    }

    saveUsers() {
        localStorage.setItem('sahideUsers', JSON.stringify(this.users));
    }

    initializeMainApp() {
        // Initialize the main application if we're on the main page
        if (typeof SAHideSourcingAgent !== 'undefined') {
            new SAHideSourcingAgent();
        }
    }

    // Logout function
    logout() {
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userName');
        window.location.href = 'login.html';
    }
}

// Initialize authentication system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AuthenticationSystem();
});

// Add logout functionality to the main app
function addLogoutButton() {
    // Check if we're on the main page and add logout button
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const nav = document.querySelector('.main-nav');
        if (nav) {
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.className = 'nav-link logout-btn';
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.clear();
                window.location.href = 'login.html';
            });
            nav.appendChild(logoutBtn);
        }
    }
}

// Call addLogoutButton after a short delay to ensure DOM is ready
setTimeout(addLogoutButton, 100);
