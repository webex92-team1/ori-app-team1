# Issue #4: サインアップフォームをFirebase Authに接続

作業ブランチ：feature/issue-4-signup-page

## 🎯 このタスクの目的

`/signup` ページのフォーム送信時に Firebase Auth でユーザーを作成し、Firestore にユーザードキュメントも作成して、食材入力ページ（`/ingredients`）に遷移できるようにする。

---

## 📁 作業で触るファイル

- `src/app/signup/page.jsx`

⚠️ **以下のファイルは触らない**

- `src/app/login/page.jsx`
- `src/lib/mockdata.js`
- `src/app/ingredients/page.jsx`
- `src/lib/firebase.js`
- `src/lib/firestore.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-4-signup-page
```

---

## 🧩 作業内容（やること）

1. フォーム送信時に `createUserWithEmailAndPassword` を呼ぶ
2. 成功したら `createUserProfile` で Firestore にユーザードキュメントを作成
3. 送信中はボタンを disabled にし、「登録中…」のテキストまたはスピナーを表示
4. エラー時は日本語メッセージでフォーム上部に表示
5. 成功後は `/ingredients` へ遷移

---

## ✅ 完成条件（チェックリスト）

- [ ] フォーム送信時に `createUserWithEmailAndPassword` が呼ばれる
- [ ] 成功時に `createUserProfile` で Firestore にドキュメントが作成される
- [ ] 送信中はボタンが disabled になり、ローディング表示が出る
- [ ] Email 形式エラーとパスワード桁数不足時にエラーメッセージが表示される
- [ ] Firebase API のエラーが日本語メッセージに変換される
- [ ] 成功後は `/ingredients` へ遷移し、`AuthProvider` がログイン状態になる

---

## 🔍 動作確認のしかた

1. `npm run dev` を起動して `http://localhost:3000/signup` を開く
2. 空入力で送信し、バリデーションエラーが表示されることを確認
3. ダミーのメール・パスワード（例: `test@example.com` / `password123`）で送信
4. スピナー表示 → `/ingredients` へ遷移することを確認
5. Firebase Console または Emulator で `users/{uid}` ドキュメントが作成されていることを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #2, #3
- このタスクが終わったら進められるもの: #5
- ラベル: `frontend`, `auth`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: サインアップページをFirebase Authに接続"`
3. `git push origin feature/issue-4-signup-page`
4. GitHub上でPRを作成

---

## 💡 ちょっとしたヒント

- Firebase Auth の関数: `createUserWithEmailAndPassword(auth, email, password)`
- Next.js の画面遷移: `useRouter()` の `router.push('/ingredients')`
- ローディング状態: `useState(false)` で管理
- エラーコードの変換例: `auth/email-already-in-use` → 「このメールアドレスは既に使用されています」

---

## 💬 メモ・質問（必要なら）

- Firebase のエラーコード一覧はドキュメントを参照してください

