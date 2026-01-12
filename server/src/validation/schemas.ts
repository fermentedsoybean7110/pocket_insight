import { z } from 'zod';

const CATEGORIES = [
  '食費',
  '交通費',
  '娯楽',
  '医療',
  '日用品',
  '通信',
  '住居',
  '光熱',
  '教育',
  'その他',
];

export const createExpenseSchema = z.object({
  date: z.string().datetime().pipe(z.coerce.date()),
  amount: z.number().int().positive('金額は1以上の整数である必要があります'),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  description: z.string().optional().default(''),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export const queryExpensesSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.string().optional(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type QueryExpensesInput = z.infer<typeof queryExpensesSchema>;

export { CATEGORIES };
