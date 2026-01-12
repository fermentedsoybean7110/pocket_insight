import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
} from '../controllers/expenseController.js';

const router = Router();

// CRUDエンドポイント
router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

// 集計エンドポイント
router.get('/summary/:month', getSummary);

export default router;
