# Issue #5: ログインページでメール/Google認証を実装

作業ブランチ：feature/issue-5-login-page

## 🎯 このタスクの目的

`/login` ページからメール＋パスワード、または Google OAuth でサインインできるようにする。エラー表示とローディング制御も追加します。

---

## 📁 作業で触るファイル

- `src/app/login/page.jsx`

⚠️ **以下のファイルは触らない**

- `src/app/signup/page.jsx`
- `src/app/layout.jsx`
- `src/lib/mockdata.js`
- `src/lib/firebase.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-5-login-page
```

---

## 🧩 作業内容（やること）

1. メールフォーム送信時に `signInWithEmailAndPassword` を呼ぶ
2. 送信中はボタンを disabled にし、スピナーを表示
3. エラーコードごとに「メールまたはパスワードが違います」などのメッセージを表示
4. 「Googleでログイン」ボタンが `signInWithPopup(googleProvider)` を呼ぶ
5. 成功時は `/ingredients` へ遷移

---

## ✅ 完成条件（チェックリスト）

- [ ] メールフォーム送信時に `signInWithEmailAndPassword` が呼ばれ、送信中はボタンが disabled になる
- [ ] エラーコードごとに日本語メッセージが表示される
- [ ] 「Googleでログイン」ボタンが `signInWithPopup` を呼び、進行中はスピナーを表示
- [ ] 成功時は `/ingredients` へ遷移し、`AuthProvider` の `user` が即時更新される
- [ ] ブラウザコンソールに `console.error` が出ていない

---

## 🔍 動作確認のしかた

1. #4 で作成したアカウントで `/login` から誤ったパスワードを入力
2. エラーメッセージが表示されることを確認
3. 正しいパスワードでログインし、`/ingredients` に遷移することを確認
4. Google ログインボタンを押し、ポップアップが開いて認証後に `/ingredients` へ戻ることを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #2
- このタスクが終わったら進められるもの: -
- ラベル: `frontend`, `auth`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: ログインページでメール/Google認証を実装"`
3. `git push origin feature/issue-5-login-page`
4. GitHub上でPRを作成

---

## 💡 ちょっとしたヒント

- Firebase Auth の関数:
  - `signInWithEmailAndPassword(auth, email, password)`
  - `signInWithPopup(auth, googleProvider)`
- Next.js の画面遷移: `useRouter()` の `router.push('/ingredients')`
- エラーコード例: `auth/user-not-found`, `auth/wrong-password` など

---

## 💬 メモ・質問（必要なら）

- Google ログインを使うには Firebase Console で Google プロバイダを有効化する必要があります

