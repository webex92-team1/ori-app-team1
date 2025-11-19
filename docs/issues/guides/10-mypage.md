# Issue #10: マイページでお気に入り・履歴を表示

作業ブランチ：feature/issue-10-mypage

## 🎯 このタスクの目的

`/mypage` を Firestore の `users/{uid}` と同期させ、リアルタイムにお気に入り・履歴を表示/削除できるようにします。ログアウト機能も追加します。

---

## 📁 作業で触るファイル

- `src/app/mypage/page.jsx`

⚠️ **以下のファイルは触らない**

- `src/app/recipes/[id]/page.jsx`
- `src/lib/mockdata.js`
- `src/app/ingredients/page.jsx`
- `src/lib/firestore.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-10-mypage
```

---

## 🧩 作業内容（やること）

1. `useAuth()` でログイン状態を確認し、未ログイン時は `/login` にリダイレクト
2. Firestore からユーザードキュメントを取得する間はスケルトン/ローディングを表示
3. お気に入りカードと履歴リストが Firestore の配列と一致し、0 件時は空状態メッセージを表示
4. 各お気に入りカードに「削除」アクションを追加し、クリックで `removeFavoriteRecipe` を呼びUIを即時更新
5. 画面下部の「ログアウト」ボタンが `signOut` を呼んで `/login` へ遷移

---

## ✅ 完成条件（チェックリスト）

- [ ] `useAuth()` で未ログイン時は `/login` にリダイレクト
- [ ] Firestore からユーザードキュメントを取得する間はローディング表示
- [ ] お気に入りカードと履歴リストが Firestore の配列と一致し、0 件時は空状態メッセージを表示
- [ ] 各お気に入りカードに「削除」アクションがあり、クリックで UI と Firestore が即時更新される
- [ ] 「ログアウト」ボタンが `signOut` を呼んで `/login` へ遷移

---

## 🔍 動作確認のしかた

1. お気に入り/履歴が登録されたアカウントで `/mypage` を開く
2. ローディング後にデータが表示されることを確認
3. お気に入りを削除し、UI と Firestore の両方で消えていることを確認
4. 「ログアウト」を押して `/login` に戻り、保護ページへアクセスするとガードされることを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #2, #3, #9
- このタスクが終わったら進められるもの: -
- ラベル: `frontend`, `firestore`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: マイページでお気に入り・履歴を表示"`
3. `git push origin feature/issue-10-mypage`
4. GitHub上でPRを作成

---

## 💡 ちょっとしたヒント

- `useAuth()` は `src/app/providers.jsx` で定義されている
- Firestore 関数: `getUserProfile(uid)`, `removeFavoriteRecipe({ uid, recipeId })`
- `signOut` は `useAuth()` から取得できる
- 空状態メッセージ: `favorites.length === 0` でチェック

---

## 💬 メモ・質問（必要なら）

- ログアウト後に保護ページにアクセスすると、自動的に `/login` に遷移するはずです

