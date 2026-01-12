import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseSummary from './components/ExpenseSummary';
import './App.css';

export interface Expense {
  _id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
}

export interface Summary {
  total: number;
  summary: Record<string, number>;
  count: number;
}

const API_URL = 'http://localhost:5000/api';

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
  }, [month]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/expenses`);
      setExpenses(res.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_URL}/expenses/summary/${month}`);
      setSummary(res.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const handleExpenseAdded = () => {
    fetchExpenses();
    fetchSummary();
  };

  const handleExpenseDeleted = () => {
    fetchExpenses();
    fetchSummary();
  };

  return (
    <div className="App">
      <header className="header">
        <h1>💰 Pocket Insight</h1>
        <p>支出を記録して、家計を管理しよう</p>
      </header>

      <main className="container">
        <div className="content">
          <div className="section">
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
          </div>

          <div className="section">
            <ExpenseSummary month={month} setMonth={setMonth} summary={summary} />
          </div>

          <div className="section">
            <h2>📋 支出一覧</h2>
            {loading ? (
              <div className="loading">読み込み中...</div>
            ) : (
              <ExpenseList expenses={expenses} onExpenseDeleted={handleExpenseDeleted} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
