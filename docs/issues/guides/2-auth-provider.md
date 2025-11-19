# Issue #2: AuthProviderとルートガードを追加

作業ブランチ：feature/issue-2-auth-provider

## 🎯 このタスクの目的

Firebase Auth の状態（ログイン中か、ユーザー情報など）をアプリ全体で共有できるようにする。また、未ログイン時は自動で `/login` に遷移する仕組み（ルートガード）を作る。

---

## 📁 作業で触るファイル

- `src/app/providers.jsx`（新規作成）
- `src/app/layout.jsx`（既存ファイルに追加）

⚠️ **以下のファイルは触らない**

- `src/app/ingredients/page.jsx`
- `src/app/login/page.jsx`
- `src/lib/mockdata.js`
- `src/lib/firebase.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-2-auth-provider
```

---

## 🧩 作業内容（やること）

1. `src/app/providers.jsx` を作成し、`AuthContext` と `useAuth()` を定義
2. `{ user, loading, signOut }` を提供する
3. `RequireAuth` コンポーネントを作成して、未ログイン時は `/login` に遷移させる
4. `src/app/layout.jsx` で `AppProviders` を使って `<body>` をラップする

---

## ✅ 完成条件（チェックリスト）

- [ ] `AuthContext` と `useAuth()` が定義され、`user`, `loading`, `signOut` が提供されている
- [ ] `RequireAuth` が loading 中はローディング UI を表示し、未ログイン時は `/login` に遷移する
- [ ] `signOut` で Firebase の `signOut()` を呼び、グローバル状態が更新される
- [ ] `layout.jsx` が `AppProviders` でラップされ、既存のフォント設定を壊していない
- [ ] ブラウザコンソールでエラーが出ていない

---

## 🔍 動作確認のしかた

1. `npm run dev` を起動して `http://localhost:3000/login` を表示
2. React DevTools（ブラウザ拡張機能）で `AuthProvider` を確認
3. 初期表示で `loading: true` → 数ms後に `loading: false` に変わることを確認
4. ブラウザコンソールでエラーが出ていないことを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #1
- このタスクが終わったら進められるもの: #4, #5, #7, #8, #9, #10
- ラベル: `frontend`, `auth`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: AuthProviderとルートガードを追加"`
3. `git push origin feature/issue-2-auth-provider`
4. GitHub上でPRを作成

---

## 💡 ちょっとしたヒント

- Firebase Auth の状態監視: `onAuthStateChanged(auth, callback)`
- React Context API: `createContext()`, `useContext()`
- Next.js の画面遷移: `useRouter()` の `router.push()`
- ローディング UI: `role="status"` を付けるとアクセシビリティ向上

---

## 💬 メモ・質問（必要なら）

- `RequireAuth` はこのタスクでは使わなくてOK（次のタスクで使います）

