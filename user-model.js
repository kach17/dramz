const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  watchedShows: [{ type: Number }] // Store TMDB IDs
});

module.exports = mongoose.model('User', userSchema);
