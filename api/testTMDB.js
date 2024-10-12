const fetch = require('node-fetch');

const TMDB_API_KEY = process.env.TMDB_API_KEY;

module.exports = async (req, res) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/215072?api_key=${TMDB_API_KEY}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};