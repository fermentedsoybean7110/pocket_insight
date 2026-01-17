import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Expense } from '../models/Expense.js';

// Use server/.env (default cwd when running via npm --prefix server)
dotenv.config({ path: './.env' });

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

const sampleExpenses = [
  // 2026年1月
  { date: new Date('2026-01-01'), amount: 1500, category: '食費', description: 'ランチ' },
  { date: new Date('2026-01-02'), amount: 200, category: '交通費', description: '駅への移動' },
  { date: new Date('2026-01-03'), amount: 3000, category: '娯楽', description: '映画' },
  { date: new Date('2026-01-04'), amount: 5000, category: '食費', description: '夕食' },
  { date: new Date('2026-01-05'), amount: 800, category: '日用品', description: 'シャンプー' },
  { date: new Date('2026-01-06'), amount: 120000, category: '住居', description: '家賃' },
  { date: new Date('2026-01-07'), amount: 2000, category: '通信', description: 'スマホ通信料' },
  { date: new Date('2026-01-08'), amount: 1200, category: '食費', description: 'スーパー' },
  { date: new Date('2026-01-09'), amount: 6000, category: '光熱', description: '電気代' },
  { date: new Date('2026-01-10'), amount: 1500, category: '食費', description: 'カフェ' },
  { date: new Date('2026-01-11'), amount: 3500, category: '医療', description: '薬局' },
  { date: new Date('2026-01-12'), amount: 2000, category: '教育', description: 'オンライン講座' },
  { date: new Date('2026-01-13'), amount: 500, category: 'その他', description: '雑費' },
  { date: new Date('2026-01-14'), amount: 4000, category: '食費', description: 'レストラン' },
  { date: new Date('2026-01-15'), amount: 300, category: '交通費', description: 'バス' },
  
  // 2025年12月
  { date: new Date('2025-12-01'), amount: 2000, category: '食費', description: 'ランチ' },
  { date: new Date('2025-12-05'), amount: 120000, category: '住居', description: '家賃' },
  { date: new Date('2025-12-10'), amount: 5000, category: '娯楽', description: 'ゲーム' },
  { date: new Date('2025-12-15'), amount: 3000, category: '食費', description: '夜食' },
  { date: new Date('2025-12-20'), amount: 8000, category: '光熱', description: 'ガス代' },
  { date: new Date('2025-12-25'), amount: 10000, category: '食費', description: 'クリスマスディナー' },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pocket_insight';
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB connected');

    // 既存データを削除
    await Expense.deleteMany({});
    console.log('✓ Cleared existing expenses');

    // サンプルデータを挿入
    const inserted = await Expense.insertMany(sampleExpenses);
    console.log(`✓ Inserted ${inserted.length} sample expenses`);

    console.log('\n📊 Sample data:');
    sampleExpenses.forEach((exp) => {
      console.log(
        `  ${exp.date.toLocaleDateString('ja-JP')} | ${exp.category.padEnd(6)} | ¥${exp.amount} | ${exp.description}`
      );
    });

    await mongoose.disconnect();
    console.log('\n✓ Seed completed');
  } catch (error) {
    console.error('✗ Seed failed:', error);
    process.exit(1);
  }
}

seed();
