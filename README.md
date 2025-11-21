# 🍳 FoodMatch

> 冷蔵庫にある食材を入力するだけで、今すぐ作れるレシピを提案するWebアプリ

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10-orange?logo=firebase)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 📖 目次

- [プロジェクト概要](#-プロジェクト概要)
- [主な機能](#-主な機能)
- [技術スタック](#-技術スタック)
- [セットアップ](#-セットアップ)
- [開発の進め方](#-開発の進め方)
- [ディレクトリ構成](#-ディレクトリ構成)
- [チーム開発](#-チーム開発)
- [ライセンス](#-ライセンス)

---

## 🎯 プロジェクト概要

**FoodMatch** は、一人暮らしの大学生や料理初心者向けに、家にある食材から簡単にレシピを探せるWebアプリケーションです。

### 💡 解決する課題

- 毎日の献立を考える負担を軽減
- 家にある食材を活用して、食材の無駄を減らす
- 料理初心者でも簡単にレシピを探せる

### 🎓 開発背景

このプロジェクトは、初心者3名のチーム開発を想定して設計されており、React × Firebase の学習に最適な構成となっています。

---

## ✨ 主な機能

| 機能 | 説明 | 優先度 |
|:---|:---|:---:|
| 🔐 **ユーザー認証** | Google ログイン / メール・パスワード認証 | ★★☆ |
| 🥬 **食材入力** | テキストで食材を入力し、レシピ検索 | ★★★ |
| 🍱 **レシピ検索** | 楽天レシピAPIから候補を自動取得 | ★★★ |
| 📄 **レシピ詳細** | 材料・手順を確認できる | ★★★ |
| ❤️ **お気に入り** | レシピを保存して後から見返せる | ★★☆ |
| 📅 **作成履歴** | 「作った！」ボタンで日付付き履歴を保存 | ★★☆ |
| 👤 **マイページ** | お気に入り・履歴を一覧表示 | ★☆☆ |

---

## 🛠️ 技術スタック

### フロントエンド
- **[Next.js 14](https://nextjs.org/)** - App Router を使用したモダンなReact フレームワーク
- **[React 18](https://reactjs.org/)** - UIライブラリ
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファーストのCSSフレームワーク
- **[shadcn/ui](https://ui.shadcn.com/)** - 美しいUIコンポーネント

### バックエンド（サーバーレス）
- **[Firebase Auth](https://firebase.google.com/docs/auth)** - 認証（Google / メール・パスワード）
- **[Firestore](https://firebase.google.com/docs/firestore)** - NoSQLデータベース（お気に入り・履歴）

### 外部API
- **[楽天レシピAPI](https://webservice.rakuten.co.jp/api/recipeapi/)** - レシピ検索

### インフラ
- **[Vercel](https://vercel.com/)** または **Firebase Hosting** - デプロイ先

---

## 🚀 セットアップ

### 必要な環境

- Node.js 18.x 以上
- npm または yarn
- Firebase プロジェクト
- 楽天レシピAPI のアプリケーションID

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USERNAME/ori-app-team1.git
cd ori-app-team1
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルをプロジェクトルートに作成し、以下の内容を設定してください：

```bash
# Firebase 設定
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 楽天レシピAPI
NEXT_PUBLIC_RAKUTEN_APP_ID=your_rakuten_app_id
```

> 💡 Firebase の設定値は [Firebase Console](https://console.firebase.google.com/) のプロジェクト設定から取得できます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

## 📚 開発の進め方

### Issue駆動開発

このプロジェクトは、初心者向けに細かく分割された Issue を用意しています。

1. `docs/issues/guides/` 配下の Issue ガイドを確認
2. `docs/issues/dependencies.md` で依存関係を確認
3. 担当する Issue のブランチを作成して実装開始

```bash
# 例: Issue #1 を担当する場合
git checkout -b feature/issue-1-firebase-init
```

### コミット規約

```bash
# 新機能
git commit -m "feat: ○○機能を追加"

# バグ修正
git commit -m "fix: ○○のバグを修正"

# リファクタリング
git commit -m "refactor: ○○を整理"

# ドキュメント
git commit -m "docs: READMEを更新"
```

### プルリクエスト

1. 実装が完了したら、GitHub で Pull Request を作成
2. チームメンバーにレビューを依頼
3. 承認されたら `main` ブランチにマージ

---

## 📁 ディレクトリ構成

```
ori-app-team1/
├── docs/                        # プロジェクトドキュメント
│   ├── 01_requirements.md       # 要件定義書
│   ├── 02_architecture.md       # アーキテクチャ設計
│   ├── 03_database.md           # DB設計（Firestore）
│   ├── 04_sitemap.md            # サイトマップ
│   ├── 05_roadmap.md            # Issue アウトライン
│   └── issues/
│       ├── guides/              # Issue実装ガイド（1-11）
│       └── dependencies.md      # Issue依存関係マップ
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── page.jsx             # トップページ
│   │   ├── ingredients/         # 食材入力ページ
│   │   ├── recipes/             # レシピ一覧・詳細
│   │   ├── mypage/              # マイページ
│   │   ├── signup/              # 新規登録
│   │   └── login/               # ログイン
│   │
│   ├── components/              # 再利用可能なUIコンポーネント
│   │   └── ui/                  # shadcn/ui コンポーネント
│   │
│   ├── lib/                     # ユーティリティ関数
│   │   ├── firebase.js          # Firebase 初期化
│   │   ├── firestore.js         # Firestore ヘルパー
│   │   └── recipes.js           # 楽天レシピAPI
│   │
│   └── styles/
│       └── globals.css          # グローバルスタイル
│
├── public/                      # 静的ファイル
├── .env.local                   # 環境変数（Git管理外）
├── package.json                 # 依存関係
└── README.md                    # このファイル
```

---

## 👥 チーム開発

### 推奨ワークフロー（3人チーム）

#### Week 1: 基盤構築
- **全員**: Issue #1（Firebase初期化）
- **担当あいりり**: Issue #2（AuthProvider）
- **担当ずーた**: Issue #6（RakutenレシピAPI）
- **担当たいちゃん**: Issue #3（Firestoreヘルパー）

#### Week 2: 認証 & 基本UI
- **担当A**: Issue #4（サインアップ）→ Issue #5（ログイン）
- **担当B**: Issue #7（食材入力）→ Issue #11（Firestoreルール）
- **担当C**: Issue #8（レシピ一覧）

#### Week 3: コア機能
- **担当A**: Issue #9（レシピ詳細）
- **担当B**: Issue #10（マイページ）
- **担当C**: 統合テスト・バグ修正

> 詳細は `docs/issues/dependencies.md` を参照してください。

### 並列作業のルール

- **1 Issue = 原則 1 ファイル編集**（競合を最小化）
- 同一ディレクトリの同時編集は避ける
- PR は小さく早くマージ
- ブロッカーが発生したらチームで優先対応

---

## 🧪 テスト

```bash
# Lintチェック
npm run lint

# ビルドテスト
npm run build
```

---

## 🚢 デプロイ

### Vercel へのデプロイ

1. [Vercel](https://vercel.com/) にログイン
2. GitHub リポジトリと連携
3. 環境変数を設定
4. デプロイ完了！

`main` ブランチへのマージで自動デプロイされます。

---

## 📖 参考資料

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [楽天レシピAPI](https://webservice.rakuten.co.jp/api/recipeapi/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📝 今後の拡張機能（Nice to have）

- [ ] 賞味期限管理
- [ ] 代替食材の提案（AI）
- [ ] カテゴリ検索（節約・ヘルシーなど）
- [ ] 写真つき料理日記
- [ ] 買い物リスト自動生成

---

## 🤝 コントリビューション

このプロジェクトは学習目的のため、Issue を通じた貢献を歓迎します！

1. Issue を確認または作成
2. フォーク & ブランチ作成
3. 実装 & コミット
4. Pull Request を作成

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

---

## 👨‍💻 開発者

**Team 1** - 初心者3名のチーム開発プロジェクト

---

## 💬 お問い合わせ

質問や提案があれば、[Issues](https://github.com/YOUR_USERNAME/ori-app-team1/issues) でお気軽にどうぞ！

---

<div align="center">
  <sub>Built with ❤️ by Team 1</sub>
</div>
