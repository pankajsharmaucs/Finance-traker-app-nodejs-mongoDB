import express from 'express';
import {
  getAllTransactions,
  addTransaction,
  deleteTransaction
} from '../controllers/transactionController.mjs';

const router = express.Router();

router.get('/', getAllTransactions);
router.post('/add', addTransaction);
router.get('/delete/:id', deleteTransaction);

export default router;
