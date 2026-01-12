import { Request, Response } from 'express';
import { Expense } from '../models/Expense.js';
import {
  createExpenseSchema,
  updateExpenseSchema,
  queryExpensesSchema,
} from '../validation/schemas.js';

// GET: 全支出取得（フィルタ対応）
export async function getExpenses(req: Request, res: Response) {
  const parsed = queryExpensesSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
        details: parsed.error.errors,
      },
    });
  }

  const { from, to, category } = parsed.data;
  const filter: Record<string, any> = {};

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  if (category) {
    filter.category = category;
  }

  const expenses = await Expense.find(filter).sort({ date: -1 });
  res.json(expenses);
}

// POST: 新規支出作成
export async function createExpense(req: Request, res: Response) {
  const parsed = createExpenseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.errors,
      },
    });
  }

  const expense = new Expense(parsed.data);
  await expense.save();

  res.status(201).json(expense);
}

// GET: 月別集計
export async function getSummary(req: Request, res: Response) {
  const { month } = req.params;

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid month format. Use YYYY-MM',
      },
    });
  }

  const [year, monthNum] = month.split('-').map(Number);
  const startDate = new Date(year, monthNum - 1, 1);
  const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

  const expenses = await Expense.find({
    date: { $gte: startDate, $lte: endDate },
  });

  const summary = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  res.json({ total, summary, count: expenses.length });
}

// PUT: 支出更新
export async function updateExpense(req: Request, res: Response) {
  const { id } = req.params;
  const parsed = updateExpenseSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request body',
        details: parsed.error.errors,
      },
    });
  }

  const expense = await Expense.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  });

  if (!expense) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Expense not found',
      },
    });
  }

  res.json(expense);
}

// DELETE: 支出削除
export async function deleteExpense(req: Request, res: Response) {
  const { id } = req.params;

  const expense = await Expense.findByIdAndDelete(id);

  if (!expense) {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Expense not found',
      },
    });
  }

  res.json({ message: 'Deleted successfully' });
}
