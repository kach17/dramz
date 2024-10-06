const API_URL = 'http://localhost:3000/api';

// Login function
async function login(username, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        localStorage.setItem('token', data.token);
        showProfile();
    } else {
        alert(data.error);
    }
}

// Sign up function
async function signup(username, password) {
    const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    if (response.ok) {
        alert('User created successfully. Please log in.');
    } else {
        alert(data.error);
    }
}

// Add show function
async function addShow(tmdbId) {
    const response = await fetch(`${API_URL}/shows/add`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ tmdbId })
    });
    const data = await response.json();
    if (response.ok) {
        showProfile();
    } else {
        alert(data.error);
    }
}

// Show profile function
async function showProfile() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('profile-container').style.display = 'block';
    
    const response = await fetch(`${API_URL}/shows/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const shows = await response.json();
    
    const showsList = document.getElementById('shows-list');
    showsList.innerHTML = '';
    shows.forEach(show => {
        const showElement = document.createElement('div');
        showElement.textContent = show.name;
        showsList.appendChild(showElement);
    });
}

// Event listeners
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    login(username, password);
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    signup(username, password);
});

document.getElementById('add-show-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const tmdbId = document.getElementById('tmdb-id').value;
    addShow(tmdbId);
});

// Check if user is already logged in
if (localStorage.getItem('token')) {
    showProfile();
}
