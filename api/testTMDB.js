const fetch = require('node-fetch');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

module.exports = async (req, res) => {
    console.log('testTMDB function called');
    console.log('TMDB_API_KEY:', TMDB_API_KEY ? 'Set' : 'Not set');

    try {
        if (!TMDB_API_KEY) {
            throw new Error('TMDB_API_KEY is not set');
        }

        const url = `https://api.themoviedb.org/3/tv/215072?api_key=${TMDB_API_KEY}`;
        console.log('Fetching from URL:', url);

        const response = await fetch(url);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`TMDB API responded with status: ${response.status}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error in testTMDB:', error);
        res.status(500).json({ error: error.toString() });
    }
};