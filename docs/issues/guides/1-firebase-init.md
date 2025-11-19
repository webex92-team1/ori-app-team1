# Issue #1: Firebase クライアント初期化モジュールを作成

作業ブランチ：feature/issue-1-firebase-init

## 🎯 このタスクの目的

Firebase（Auth / Firestore）を初期化して、アプリ全体から使えるようにする。環境変数から設定を読み込んで、多重初期化を防ぐ仕組みも入れます。

---

## 📁 作業で触るファイル

- `src/lib/firebase.js`（新規作成）

⚠️ **以下のファイルは触らない**

- `src/app/layout.jsx`
- `src/app/login/page.jsx`
- `src/lib/mockdata.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-1-firebase-init
```

---

## 🧩 作業内容（やること）

1. `src/lib/firebase.js` を新規作成
2. `initializeApp` で Firebase を初期化（多重初期化を防ぐため `getApps()` を使う）
3. `auth`、`db`、`googleProvider` をエクスポート
4. 必須の環境変数（`NEXT_PUBLIC_FIREBASE_*`）がない場合はエラーを表示

---

## ✅ 完成条件（チェックリスト）

- [ ] `src/lib/firebase.js` が作成され、`auth`, `db`, `googleProvider` がエクスポートされている
- [ ] `getApps()` で多重初期化を防いでいる
- [ ] 環境変数が存在しない場合に `console.error` でエラーが出る
- [ ] `npm run lint` がエラー無く完了する
- [ ] ブラウザコンソールに Firebase 初期化エラーが出ない

---

## 🔍 動作確認のしかた

1. `.env.local` に Firebase の設定を入力する（プロジェクトの設定から取得）
2. `npm run dev` を実行
3. `http://localhost:3000/login` にアクセス
4. ブラウザのコンソール（F12）を開いて、`Firebase: No Firebase App` などのエラーが出ていないことを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: -
- このタスクが終わったら進められるもの: #2, #3
- ラベル: `infra`, `firestore`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: Firebase初期化モジュールを追加"`
3. `git push origin feature/issue-1-firebase-init`
4. GitHub 上で PR を作成

---

## 💡 ちょっとしたヒント

- Firebase SDK の関数: `initializeApp()`, `getAuth()`, `getFirestore()`, `GoogleAuthProvider()`
- 環境変数は `process.env.NEXT_PUBLIC_FIREBASE_API_KEY` のように参照する
- `getApps().length === 0` で初期化済みかチェックできる

---

## 💬 メモ・質問（必要なら）

- Firebase プロジェクトの設定値はチームで共有してもらってください
