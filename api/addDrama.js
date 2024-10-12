const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    console.log('addDrama called', req.body);
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { tmdbId } = req.body;
    if (!tmdbId) {
        return res.status(400).json({ message: 'TMDB ID is required' });
    }

    let client;
    try {
        const tmdbResponse = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`);
        if (!tmdbResponse.ok) {
            throw new Error(`TMDB API error: ${tmdbResponse.status}`);
        }
        const dramaData = await tmdbResponse.json();

        client = await MongoClient.connect(MONGODB_URI);
        const db = client.db('kdrama_tracker');
        const result = await db.collection('dramas').insertOne(dramaData);

        res.status(200).json({ message: 'Drama added successfully', id: result.insertedId });
    } catch (error) {
        console.error('Error in addDrama:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        if (client) await client.close();
    }
};