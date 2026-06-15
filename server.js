const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (if you have a frontend build)
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.log('No MONGO_URI provided — skipping MongoDB connection');
}

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));