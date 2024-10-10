const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    console.log('addDrama function called');
    console.log('MONGODB_URI:', MONGODB_URI ? 'Set' : 'Not set');
    console.log('TMDB_API_KEY:', TMDB_API_KEY ? 'Set' : 'Not set');

    if (req.method === 'POST') {
        console.log('POST request received');
        const { tmdbId } = req.body;
        console.log('TMDB ID:', tmdbId);

        let client;
        try {
            console.log('Fetching data from TMDB API');
            const tmdbResponse = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`);
            if (!tmdbResponse.ok) {
                throw new Error(`TMDB API responded with status: ${tmdbResponse.status}`);
            }
            const dramaData = await tmdbResponse.json();
            console.log('TMDB data fetched successfully');

            console.log('Connecting to MongoDB');
            client = await MongoClient.connect(MONGODB_URI);
            console.log('Connected to MongoDB');
            
            const db = client.db('kdrama_tracker');
            const dramas = db.collection('dramas');

            console.log('Inserting drama data into MongoDB');
            const result = await dramas.insertOne({
                tmdbId: dramaData.id,
                name: dramaData.name,
                genres: dramaData.genres.map(genre => genre.name),
                overview: dramaData.overview,
                poster: `https://image.tmdb.org/t/p/w500${dramaData.poster_path}`,
                rating: dramaData.vote_average,
                releaseDate: dramaData.first_air_date,
                backdrops: dramaData.backdrop_path ? [`https://image.tmdb.org/t/p/original${dramaData.backdrop_path}`] : []
            });

            console.log('Insertion result:', result);
            res.status(200).json({ message: 'Drama added successfully', dramaId: result.insertedId });
        } catch (error) {
            console.error('Error in addDrama:', error);
            res.status(500).json({ message: 'An error occurred', error: error.toString() });
        } finally {
            if (client) {
                await client.close();
                console.log('MongoDB connection closed');
            }
        }
    } else {
        console.log('Method not allowed:', req.method);
        res.status(405).json({ message: 'Method not allowed' });
    }
};