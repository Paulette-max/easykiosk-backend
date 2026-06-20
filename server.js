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

// --- Mock API endpoints to avoid 404s during development ---
// In-memory data store for development
const db = {
  products: [],
  sales: [],
  stockMoves: [],
  categories: [],
  suppliers: []
};

// Products CRUD
app.get('/api/products', (req, res) => {
  return res.json(db.products);
});

app.post('/api/products', (req, res) => {
  const product = Object.assign({}, req.body);
  product._id = (Date.now() + Math.random()).toString(36);
  db.products.unshift(product);
  return res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const idx = db.products.findIndex(p => p._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products[idx] = Object.assign({}, db.products[idx], req.body, { _id: id });
  return res.json(db.products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const idx = db.products.findIndex(p => p._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });
  db.products.splice(idx, 1);
  return res.status(204).end();
});

// Sales
app.get('/api/sales', (req, res) => res.json(db.sales));
app.post('/api/sales', (req, res) => {
  const sale = Object.assign({}, req.body);
  sale.qty = Number(sale.qty) || 0;
  sale.price = Number(sale.price) || 0;
  sale.total = sale.total !== undefined ? Number(sale.total) : sale.qty * sale.price;
  sale._id = (Date.now()+Math.random()).toString(36);
  sale.date = new Date();
  db.sales.unshift(sale);
  return res.status(201).json(sale);
});

// Stock moves
app.get('/api/stock-moves', (req, res) => res.json(db.stockMoves));
app.post('/api/stock-moves', (req, res) => {
  const m = Object.assign({}, req.body, { _id: (Date.now()+Math.random()).toString(36), date: new Date() });
  db.stockMoves.unshift(m);
  return res.status(201).json(m);
});

// Categories
app.get('/api/categories', (req, res) => res.json(db.categories));
app.post('/api/categories', (req, res) => {
  const c = Object.assign({}, req.body, { _id: (Date.now()+Math.random()).toString(36) });
  db.categories.unshift(c);
  return res.status(201).json(c);
});

app.put('/api/categories/:id', (req, res) => {
  const id = req.params.id;
  const idx = db.categories.findIndex(c => c._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories[idx] = Object.assign({}, db.categories[idx], req.body, { _id: id });
  return res.json(db.categories[idx]);
});

app.delete('/api/categories/:id', (req, res) => {
  const id = req.params.id;
  const idx = db.categories.findIndex(c => c._id === id);
  if (idx === -1) return res.status(404).json({ error: 'Category not found' });
  db.categories.splice(idx, 1);
  return res.status(204).end();
});

// Suppliers
app.get('/api/suppliers', (req, res) => res.json(db.suppliers));
app.post('/api/suppliers', (req, res) => {
  const s = Object.assign({}, req.body, { _id: (Date.now()+Math.random()).toString(36) });
  db.suppliers.unshift(s);
  return res.status(201).json(s);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));