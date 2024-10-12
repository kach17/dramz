const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

module.exports = async (req, res) => {
    console.log('getDramas function called');
    console.log('MONGODB_URI:', MONGODB_URI ? 'Set' : 'Not set');

    let client;
    try {
        console.log('Attempting to connect to MongoDB');
        client = await MongoClient.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const db = client.db('kdrama_tracker');
        const dramas = db.collection('dramas');

        console.log('Fetching dramas from database');
        const dramaList = await dramas.find().toArray();
        console.log(`Found ${dramaList.length} dramas`);

        res.status(200).json(dramaList);
    } catch (error) {
        console.error('Error in getDramas:', error);
        res.status(500).json({ 
            message: 'An error occurred while fetching dramas', 
            error: error.toString(),
            stack: error.stack,
            mongodbUri: MONGODB_URI ? 'Set' : 'Not set'
        });
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed');
        }
    }
};