/*
 * Example GET query:
 *   curl "http://localhost:3000/api/v1/movies?page=1&limit=10"
 *   curl "http://localhost:3000/v1/library/search?name=avengers"
 */

const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const mongoURI = 'mongodb://localhost:27017/test';

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => console.error('MongoDB connection error:', err));

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  year: Number,
  cast: [String],
  genres: [String],
  href: String,
  extract: String,
  thumbnail: String,
  thumbnail_width: Number,
  thumbnail_height: Number,
});

const Movie = mongoose.model('Movie', movieSchema);

app.get('/api/v1/movies', async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: 'Invalid pagination parameters. "page" and "limit" must be positive numbers.' });
    }

    const skip = (page - 1) * limit;
    const movies = await Movie.find().sort({ year: -1 }).skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({ page, limit, totalPages, totalMovies, movies });
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/v1/library/search', async (req, res) => {
  try {
    let { name, page = 1, limit = 10 } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Query parameter "name" is required.' });
    }
    
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ message: 'Invalid pagination parameters. "page" and "limit" must be positive numbers.' });
    }

    const skip = (page - 1) * limit;
    const regex = new RegExp(name, 'i');
    const movies = await Movie.find({ title: regex }).sort({ year: -1 }).skip(skip).limit(limit);
    const totalMovies = await Movie.countDocuments({ title: regex });
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({ page, limit, totalPages, totalMovies, movies });
  } catch (err) {
    console.error('Error searching movies:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
