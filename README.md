# Atlas サンプルダッシュボード

Next.js App Router で作った実験用サイトです。ユーザー、店舗、企業の業績、社員情報を一覧・検索・絞り込み・詳細表示で確認できます。表示データはすべて架空です。

## 起動

```bash
npm install
npm run dev
```

ブラウザーで `http://localhost:3000` を開きます。`npm run build` で本番ビルドを確認できます。

## データの場所

| データ     | JSON                  | API              |
| ---------- | --------------------- | ---------------- |
| ユーザー   | `data/users.json`     | `/api/users`     |
| 店舗       | `data/stores.json`    | `/api/stores`    |
| 企業・業績 | `data/companies.json` | `/api/companies` |
| 社員       | `data/employees.json` | `/api/employees` |

各 JSON の `companyId` は `companies.json` の `id` を参照します。API は読み取り専用で、`{ items, count }` を返します。

## DB への切り替え

データ取得は [`lib/repository.ts`](lib/repository.ts) の `getUsers`、`getStores`、`getCompanies`、`getEmployees` に集約しています。DB 導入時はこれらの関数をクエリに置き換えてください。返り値の型は [`lib/types.ts`](lib/types.ts) に定義済みで、画面と API の変更は基本的に不要です。

現在は閲覧用のサンプルです。認証や更新機能は実装していません。
