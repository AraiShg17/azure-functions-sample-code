# ファイル構成ガイド

このリポジトリの画面、データ、設定ファイルの場所をまとめています。画面は Next.js App Router で構成されています。

## ディレクトリ構成

```text
.
├── app/
│   ├── [section]/page.tsx       # 各一覧ページ（ユーザー、店舗、企業、社員）
│   ├── api/[entity]/route.ts     # JSON を返す読み取り専用 API
│   ├── globals.css               # サイト全体のスタイル
│   ├── layout.tsx                # 共通レイアウトとページメタデータ
│   └── page.tsx                  # トップのダッシュボード
├── components/
│   └── dashboard.tsx             # ナビ、集計、一覧、検索、詳細パネルの UI
├── data/
│   ├── companies.json            # 企業情報と業績
│   ├── employees.json            # 社員情報
│   ├── stores.json               # 店舗情報
│   └── users.json                # ユーザー情報
├── lib/
│   ├── repository.ts             # データ取得の窓口（DB 導入時の差し替え先）
│   └── types.ts                  # データ型と画面区分の定義
├── AGENTS.md                     # Next.js が生成する開発エージェント向け指示
├── CLAUDE.md                     # AGENTS.md への参照
├── LICENSE                       # MIT ライセンス
├── README.md                     # 概要、起動方法、DB 切り替え方針
├── eslint.config.mjs             # ESLint 設定
├── next.config.ts                # Next.js 設定
├── package-lock.json             # npm 依存関係の固定情報
├── package.json                  # 依存パッケージと実行コマンド
├── sitemap.md                    # このファイル
└── tsconfig.json                 # TypeScript 設定
```

## URL と対応ファイル

| URL | 表示内容 | ページファイル | 元データ |
| --- | --- | --- | --- |
| `/` | 概要ダッシュボード | [`app/page.tsx`](app/page.tsx) | 4 種類すべて |
| `/users` | ユーザー一覧 | [`app/[section]/page.tsx`](app/%5Bsection%5D/page.tsx) | [`data/users.json`](data/users.json) |
| `/stores` | 店舗一覧 | [`app/[section]/page.tsx`](app/%5Bsection%5D/page.tsx) | [`data/stores.json`](data/stores.json) |
| `/companies` | 企業・業績一覧 | [`app/[section]/page.tsx`](app/%5Bsection%5D/page.tsx) | [`data/companies.json`](data/companies.json) |
| `/employees` | 社員一覧 | [`app/[section]/page.tsx`](app/%5Bsection%5D/page.tsx) | [`data/employees.json`](data/employees.json) |
| `/api/users` など | 各データの JSON 応答 | [`app/api/[entity]/route.ts`](app/api/%5Bentity%5D/route.ts) | 対応する `data/*.json` |

一覧ページは共通の [`components/dashboard.tsx`](components/dashboard.tsx) を使い、URL の `section` に応じて表示を切り替えます。

## データの流れ

```text
data/*.json
   ↓
lib/repository.ts
   ├── app/page.tsx / app/[section]/page.tsx → components/dashboard.tsx
   └── app/api/[entity]/route.ts             → /api/* の JSON 応答
```

- サンプルデータを変更するときは `data/*.json` を編集します。
- データ項目を追加するときは [`lib/types.ts`](lib/types.ts) の型と、必要な画面表示を更新します。
- DB に移行するときは [`lib/repository.ts`](lib/repository.ts) の取得関数を DB クエリに置き換えます。
- 色や余白などの見た目は [`app/globals.css`](app/globals.css) で調整します。

`node_modules/` と `.next/` はインストール・ビルド時の生成物なので、この一覧には含めていません。
