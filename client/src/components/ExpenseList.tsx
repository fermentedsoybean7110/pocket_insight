import React from 'react';
import axios from 'axios';
import { Expense } from '../App';
import '../styles/ExpenseList.css';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

function ExpenseList({ expenses, onExpenseDeleted }: ExpenseListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('削除しますか？')) {
      try {
        await axios.delete(`${API_URL}/expenses/${id}`);
        onExpenseDeleted();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('削除に失敗しました');
      }
    }
  };

  if (expenses.length === 0) {
    return <div className="empty-message">支出がまだ記録されていません</div>;
  }

  return (
    <div className="expense-list">
      <table>
        <thead>
          <tr>
            <th>日付</th>
            <th>カテゴリ</th>
            <th className="amount">金額</th>
            <th>説明</th>
            <th className="action">操作</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id} className="expense-row">
              <td>{new Date(expense.date).toLocaleDateString('ja-JP')}</td>
              <td>{expense.category}</td>
              <td className="amount">¥{expense.amount.toLocaleString()}</td>
              <td className="description">{expense.description}</td>
              <td className="action">
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(expense._id)}
                  title="削除"
                >
                  削除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;
