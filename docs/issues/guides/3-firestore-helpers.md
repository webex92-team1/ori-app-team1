# Issue #3: Firestoreデータアクセサ群の実装

作業ブランチ：feature/issue-3-firestore-helpers

## 🎯 このタスクの目的

Firestore の `users/{uid}` ドキュメントを読み書きするヘルパー関数を作成する。お気に入り・履歴の追加/削除が簡単にできるようにして、各ページで直接 Firestore を叩かなくて済むようにします。

---

## 📁 作業で触るファイル

- `src/lib/firestore.js`（新規作成）

⚠️ **以下のファイルは触らない**

- `src/app/signup/page.jsx`
- `src/app/recipes/[id]/page.jsx`
- `src/app/mypage/page.jsx`
- `src/lib/firebase.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-3-firestore-helpers
```

---

## 🧩 作業内容（やること）

1. `src/lib/firestore.js` を新規作成
2. 以下の関数を実装する：
   - `createUserProfile({ uid, email, name })` - 新規ユーザーのドキュメント作成
   - `getUserProfile(uid)` - ユーザー情報を取得
   - `upsertFavoriteRecipe({ uid, recipe })` - お気に入りに追加（重複防止付き）
   - `removeFavoriteRecipe({ uid, recipeId })` - お気に入りから削除
   - `addHistoryEntry({ uid, recipe })` - 履歴に追加（日付付き）
3. エラーハンドリングを追加（`console.error` + 自前の `Error` をスロー）

---

## ✅ 完成条件（チェックリスト）

- [ ] `createUserProfile` が `favorites: []`, `histories: []`, `createdAt` を含むドキュメントを作成する
- [ ] `getUserProfile` が Firestore からデータを取得し、存在しない場合は `null` を返す
- [ ] `upsertFavoriteRecipe` と `removeFavoriteRecipe` が配列の重複をチェックして正しく動作する
- [ ] `addHistoryEntry` が `YYYY-MM-DD` 形式の日付を付与し、新しい履歴を先頭に追加する
- [ ] すべての関数が Firestore 例外を `console.error` + `Error` でラップしている

---

## 🔍 動作確認のしかた

1. Firebase Emulator または本番プロジェクトに接続
2. 以下のコマンドでテストする（Node.js 環境）：

```bash
node --env-file=.env.local -e "import('./src/lib/firestore.js').then(async (m)=>{await m.createUserProfile({uid:'dev-test',email:'dev@example.com',name:'Dev'}); console.log(await m.getUserProfile('dev-test')); process.exit(0);})"
```

3. Firebase Console または Emulator UI で `users/dev-test` にデータが作成されていることを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #1
- このタスクが終わったら進められるもの: #4, #9, #10, #11
- ラベル: `firestore`, `infra`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: Firestoreデータアクセサ群を実装"`
3. `git push origin feature/issue-3-firestore-helpers`
4. GitHub上でPRを作成

---

## 💡 ちょっとしたヒント

- Firestore の関数: `doc()`, `setDoc()`, `getDoc()`, `updateDoc()`, `arrayUnion()`, `arrayRemove()`
- 日付フォーマット: `date-fns` の `format(new Date(), 'yyyy-MM-dd')` を使う
- 配列の重複防止: `arrayUnion()` を使うと自動で重複を防げる

---

## 💬 メモ・質問（必要なら）

- Firebase Emulator の起動方法がわからない場合はチームに確認してください

