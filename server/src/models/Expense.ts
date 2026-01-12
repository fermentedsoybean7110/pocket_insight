import { Schema, model, Document } from 'mongoose';

export interface IExpense extends Document {
  date: Date;
  amount: number;
  category: string;
  description: string;
  createdAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  date: { type: Date, required: true, index: true },
  amount: { type: Number, required: true, min: 1 },
  category: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// 複合インデックス（日付とカテゴリで検索を高速化）
expenseSchema.index({ date: 1, category: 1 });

export const Expense = model<IExpense>('Expense', expenseSchema);
