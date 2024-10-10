const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    console.log('testMongo function called');
    console.log('MONGODB_URI:', MONGODB_URI ? 'Set' : 'Not set');

    let client;
    try {
        console.log('Connecting to MongoDB');
        client = await MongoClient.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = client.db('kdrama_tracker');
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections);

        res.status(200).json({ message: 'MongoDB connection successful', collections });
    } catch (error) {
        console.error('Error in testMongo:', error);
        res.status(500).json({ message: 'An error occurred', error: error.toString() });
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
};