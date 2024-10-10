document.getElementById('addDramaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const tmdbId = document.getElementById('tmdbId').value;
    
    try {
        const response = await fetch('/api/addDrama', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tmdbId })
        });
        
        const data = await response.json();
        
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
    try {
        const response = await fetch('/api/getDramas');
        const dramas = await response.json();
        
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
        alert('An error occurred while loading dramas');
    }
}

loadDramas();