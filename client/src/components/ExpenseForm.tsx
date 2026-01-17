import React, { useState } from 'react';
import axios from 'axios';
import { CATEGORIES } from '../constants/categories';
import '../styles/ExpenseForm.css';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

interface ExpenseFormProps {
  onExpenseAdded: () => void;
}

function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: CATEGORIES[0],
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.amount || parseInt(form.amount) <= 0) {
      setError('金額は1以上の数値を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await axios.post(`${API_URL}/expenses`, {
        date: new Date(form.date).toISOString(),
        amount: parseInt(form.amount),
        category: form.category,
        description: form.description,
      });

      setForm({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: CATEGORIES[0],
        description: '',
      });

      onExpenseAdded();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || '登録に失敗しました');
      console.error('Error adding expense:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form">
      <h2>支出を記録</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">日付</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">金額 (円)</label>
          <input
            id="amount"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">カテゴリ</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">説明（任意）</label>
          <input
            id="description"
            type="text"
            placeholder="ランチなど"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '記録中...' : '記録する'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
