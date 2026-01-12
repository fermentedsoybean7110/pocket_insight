import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Summary } from '../App';
import '../styles/ExpenseSummary.css';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseSummaryProps {
  month: string;
  setMonth: (month: string) => void;
  summary: Summary | null;
}

function ExpenseSummary({ month, setMonth, summary }: ExpenseSummaryProps) {
  if (!summary) {
    return <div className="loading">集計データを読み込み中...</div>;
  }

  const chartData = {
    labels: Object.keys(summary.summary),
    datasets: [
      {
        data: Object.values(summary.summary),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
          '#4BC0C0',
          '#FF9F40',
        ],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="expense-summary">
      <h2>📊 月別集計</h2>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="month-picker"
      />

      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-label">合計支出</div>
          <div className="stat-value">¥{summary.total.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">記録数</div>
          <div className="stat-value">{summary.count}件</div>
        </div>
      </div>

      {Object.keys(summary.summary).length > 0 ? (
        <div className="chart-container">
          <Pie data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="empty-message">この月のデータはまだありません</div>
      )}

      <div className="category-breakdown">
        <h3>カテゴリ別内訳</h3>
        <ul>
          {Object.entries(summary.summary).map(([category, amount]) => (
            <li key={category}>
              <span className="category-name">{category}</span>
              <span className="category-amount">¥{amount.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExpenseSummary;
