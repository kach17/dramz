const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            // Connect to MongoDB
            const client = await MongoClient.connect(MONGODB_URI);
            const db = client.db('kdrama_tracker');
            const dramas = db.collection('dramas');

            // Fetch all dramas from the database
            const dramaList = await dramas.find().toArray();

            client.close();
            res.status(200).json(dramaList);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'An error occurred' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
};