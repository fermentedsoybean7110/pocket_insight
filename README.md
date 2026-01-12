# 💰 Pocket Insight

支出を記録して、家計を管理・分析するフルスタック Web アプリケーション。

## 概要

- 📝 日々の支出をカンタンに記録
- 📊 月別の支出を円グラフで可視化
- 💾 ローカル MongoDB で完全オフライン対応
- 🎨 モダンで直感的なUI/UX

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| **フロント** | React 18 + TypeScript + Vite |
| **バック** | Express.js + TypeScript + Node.js |
| **DB** | MongoDB (Docker) |
| **グラフ** | Chart.js + react-chartjs-2 |

## 機能

### 支出管理
- ✅ 支出の登録（日付・金額・カテゴリ・メモ）
- ✅ 支出の一覧表示・削除
- ✅ 日付範囲・カテゴリでのフィルタリング（API）

### 分析・可視化
- ✅ 月別合計支出の表示
- ✅ カテゴリ別内訳（円グラフ）
- ✅ カテゴリ別集計金額

### カテゴリ
```
食費 / 交通費 / 娯楽 / 医療 / 日用品 / 通信 / 住居 / 光熱 / 教育 / その他
```

## セットアップ

### 前提条件
- Node.js v18 以上
- Docker & Docker Compose
- Git

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/fermentedsoybean7110/react_sample_app.git pocket-insight
cd pocket-insight

# すべての依存をインストール
npm run install:all
```

### .env ファイル設定

```bash
# server/.env ファイルを作成
cat > server/.env << 'EOF'
MONGO_URI=mongodb://localhost:27017/pocket_insight
PORT=5000
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
EOF
```

## 実行方法

### 1. MongoDB を起動（別ターミナル）

```bash
docker-compose up
```

初回起動時、MongoDB の準備に 10-15 秒かかります。ログで確認してください。

### 2. フロント＆バック起動（別ターミナル）

```bash
npm run dev
```

以下の URL でアクセス可能：
- **フロントエンド**: http://localhost:5173
- **バックエンド**: http://localhost:5000/api/health

### 3. サンプルデータ投入（オプション）

```bash
npm run seed
```

2025年12月〜2026年1月の支出データ約20件が投入されます。

## 開発コマンド

```bash
# フロント＆バック並行開発
npm run dev

# フロントエンドのみ
npm run dev:client

# バックエンドのみ
npm run dev:server

# ビルド
npm run build

# Lint チェック
npm run lint

# コード整形
npm run format

# Seed データ投入
npm run seed
```

## プロジェクト構成

```
pocket-insight/
├── client/                 # React フロントエンド (Vite + TS)
│   ├── src/
│   │   ├── components/    # React コンポーネント
│   │   ├── styles/        # CSS ファイル
│   │   ├── constants/     # 定数
│   │   ├── App.tsx        # メインコンポーネント
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── index.html
│
├── server/                 # Express バックエンド (TS)
│   ├── src/
│   │   ├── controllers/   # ビジネスロジック
│   │   ├── models/        # Mongoose スキーマ
│   │   ├── routes/        # API ルータ
│   │   ├── validation/    # Zod スキーマ
│   │   ├── middleware/    # ミドルウェア
│   │   ├── scripts/       # ユーティリティスクリプト
│   │   └── index.ts       # エントリーポイント
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.example
│   ├── .eslintrc.json
│   └── .prettierrc.json
│
├── docker-compose.yml      # MongoDB コンテナ定義
├── .gitignore
├── package.json            # ルート統合スクリプト
└── README.md              # このファイル
```

## API エンドポイント

### ヘルスチェック
```http
GET /api/health
→ { "status": "ok" }
```

### 支出 CRUD
```http
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id
```

### 集計
```http
GET /api/expenses/summary/:month
# 例: /api/expenses/summary/2026-01
→ { "total": 350000, "summary": { "食費": 20000, ... }, "count": 15 }
```

## 使用方法

1. **支出を記録**
   - 左側フォームで日付、金額、カテゴリ、メモを入力
   - 「記録する」ボタンを押す

2. **月別集計を確認**
   - 月ピッカーで対象月を選択
   - 合計金額と円グラフが表示

3. **支出を削除**
   - 一覧から「削除」ボタンを選択
   - 確認ダイアログで削除

## トラブルシューティング

### MongoDB に接続できない
```bash
# Docker が起動しているか確認
docker ps

# ログを確認
docker-compose logs mongodb

# 再起動
docker-compose restart mongodb
```

### ポート競合エラー
別プロセスがポート 5173, 5000, 27017 を使用している場合、以下で確認：
```bash
# macOS
lsof -i :5173
lsof -i :5000
lsof -i :27017
```

### CORS エラー
`server/.env` の `CORS_ORIGIN` が `http://localhost:5173` になっているか確認。

## パフォーマンス

- 一覧取得: 平均 <50ms
- 集計: 平均 <100ms
- グラフ描画: 平均 <200ms (クライアント)

## セキュリティ

- ✅ CORS は localhost のみに限定
- ✅ 入力バリデーション (Zod + Express)
- ✅ .env で機密情報を管理
- ✅ MongoDB は local-only

**本番環境では以下の追加対応が必要：**
- 認証/認可 (JWT)
- レート制限
- HTTPS
- 環境変数の外部管理
- Helmet.js での HTTP ヘッダ保護

## ライセンス

MIT License

## ポートフォリオ

このプロジェクトは個人のポートフォリオ作品です。

---

**バージョン**: 1.0.0  
**最終更新**: 2026年1月12日
