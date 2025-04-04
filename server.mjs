// server.mjs

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import { fileURLToPath } from 'url';

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// App config
const app = express();
const PORT = process.env.PORT || 5000;

// DB connection
mongoose.connect(process.env.MONGODB_URI, {})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ DB Error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'financetrack_secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mongo Schema
const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['income', 'expense'], required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'Others' },
  description: String,
  date: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Routes
app.get('/', async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  res.render('home', { transactions, income, expense, balance });
});

app.post('/add', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    await Transaction.create({ type, amount, category, description, date });
    req.flash('success', 'Transaction added successfully!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Error adding transaction.');
    res.redirect('/');
  }
});

app.get('/delete/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    req.flash('success', 'Transaction deleted.');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'Error deleting transaction.');
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
