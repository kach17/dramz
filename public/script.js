document.getElementById('addDramaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tmdbId = document.getElementById('tmdbId').value;
    console.log('Submitting TMDB ID:', tmdbId);
    
    try {
        console.log('Sending POST request to /api/addDrama');
        const response = await fetch('/api/addDrama', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tmdbId })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok) {
            alert('Drama added successfully!');
            loadDramas();
        } else {
            alert(`Failed to add drama: ${data.message}`);
            console.error('Error details:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the drama');
    }
});

async function loadDramas() {
    console.log('Loading dramas');
    try {
        const response = await fetch('/api/getDramas');
        console.log('getDramas response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Response text:', text);
        
        let dramas;
        try {
            dramas = JSON.parse(text);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            throw new Error('Invalid JSON response');
        }
        
        console.log('Dramas loaded:', dramas);
        
        const dramaList = document.getElementById('dramaList');
        dramaList.innerHTML = '';
        
        dramas.forEach(drama => {
            const dramaCard = document.createElement('div');
            dramaCard.className = 'drama-card';
            dramaCard.innerHTML = `
                <img src="${drama.poster}" alt="${drama.name}">
                <h3>${drama.name}</h3>
                <p>Rating: ${drama.rating}</p>
            `;
            dramaList.appendChild(dramaCard);
        });
    } catch (error) {
        console.error('Error loading dramas:', error);
        alert('An error occurred while loading dramas: ' + error.message);
    }
}

loadDramas();