# Issue #9: レシピ詳細ページでお気に入り・履歴を同期

作業ブランチ：feature/issue-9-recipe-detail-page

## 🎯 このタスクの目的

`/recipes/[id]` を Rakuten API の詳細データに差し替え、「お気に入り」「作った！」ボタンから Firestore の favorites / histories を更新できるようにします。

---

## 📁 作業で触るファイル

- `src/app/recipes/[id]/page.jsx`

⚠️ **以下のファイルは触らない**

- `src/app/recipes/page.jsx`
- `src/app/mypage/page.jsx`
- `src/lib/mockdata.js`
- `src/lib/firestore.js`
- `src/lib/recipes.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-9-recipe-detail-page
```

---

## 🧩 作業内容（やること）

1. パラメータ `id` を使って `getRecipeDetail` を呼び、読み込み完了までスケルトンを表示
2. レシピが存在しない場合は 404 UI + `/recipes` への導線を表示
3. 「お気に入り」ボタンが Firestore の favorites に追加/削除し、状態に応じてラベル/色を切り替え
4. 「作った！」ボタンで `addHistoryEntry` を呼び、同一日重複は抑止
5. 書き込み中は各ボタンを disabled にし、成功/失敗を toast で通知

---

## ✅ 完成条件（チェックリスト）

- [ ] パラメータ `id` で `getRecipeDetail` を呼び、読み込み完了までスケルトンを表示
- [ ] レシピが存在しない場合は 404 UI + `/recipes` への導線を表示
- [ ] 「お気に入り」ボタンが favorites に追加/削除し、状態に応じてラベル/色を切り替え
- [ ] 「作った！」ボタンで `addHistoryEntry` を呼び、同一日重複は抑止
- [ ] 書き込み中は各ボタンを disabled にし、成功/失敗を toast で通知

---

## 🔍 動作確認のしかた

1. `/recipes` から任意のカードをクリックして詳細ページを開く
2. ローディング → 詳細表示が切り替わることを確認
3. 「お気に入り」ボタンを押し、Firebase Console の `favorites` 配列にレシピIDが追加されることを確認
4. 「作った！」ボタンを押し、`histories` に日付付きで追加されることを確認
5. 同じ日に再度「作った！」を押すとトーストで拒否されることを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #2, #3, #6, #8
- このタスクが終わったら進められるもの: #10
- ラベル: `frontend`, `firestore`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: レシピ詳細ページでお気に入り・履歴を同期"`
3. `git push origin feature/issue-9-recipe-detail-page`
4. GitHub上でPRを作成

---

## 💡 ちょっとしたヒント

- Next.js の動的ルート: `params.id` でレシピIDを取得
- Firestore 関数: `upsertFavoriteRecipe()`, `removeFavoriteRecipe()`, `addHistoryEntry()`
- Toast 通知: `sonner` の `toast.success()`, `toast.error()` を使う
- 日付の重複チェック: `format(new Date(), 'yyyy-MM-dd')` で今日の日付を取得し、`histories` 配列に同じ日付があるかチェック

---

## 💬 メモ・質問（必要なら）

- `getRecipeDetail` は `src/lib/recipes.js` で定義されています

