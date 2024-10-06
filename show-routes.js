const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { tmdbId } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user.watchedShows.includes(tmdbId)) {
      user.watchedShows.push(tmdbId);
      await user.save();
    }
    res.json({ message: 'Show added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error adding show' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const showsData = await Promise.all(user.watchedShows.map(async (tmdbId) => {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`);
      return response.data;
    }));
    res.json(showsData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

module.exports = router;
