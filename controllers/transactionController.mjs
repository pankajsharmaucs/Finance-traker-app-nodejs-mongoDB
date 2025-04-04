import { Transaction } from '../models/Transaction.mjs';

export const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  res.render('index', { transactions, income, expense, balance });
};

export const addTransaction = async (req, res) => {
  const { type, amount, description } = req.body;
  await Transaction.create({ type, amount, description });
  res.redirect('/');
};

export const deleteTransaction = async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.redirect('/');
};
