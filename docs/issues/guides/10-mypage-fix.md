# Issue #10-fix: マイページ Firestore 同期のバグ修正

作業ブランチ：feature/issue-10-mypage-fix

## 🎯 このタスクの目的

`/mypage` のお気に入り・履歴表示が Firestore のスキーマとずれており、削除が失敗する問題を修正します。データのキーを Firestore 側の `id`/`date` に合わせ、UI と Firestore が即時に同期する状態に戻します。

---

## 📁 作業で触るファイル

- `src/app/mypage/page.jsx`

⚠️ **以下のファイルは触らない**

- `src/app/recipes/[id]/page.jsx`
- `src/lib/firestore.js`
- `src/lib/mockdata.js`

---

## 🧩 作業内容（やること）

1. Firestore スキーマに合わせる  
   - `favorites` は `id` を持つので、リンクやキーは `recipeId` ではなく `id` を使う。履歴も `date` をそのまま表示する。  
   - 必要なら取得後に UI 用へ正規化（例：`{ ...fav, recipeId: fav.id, cookedDate: fav.date }`）し、以降の参照を揃える。
2. お気に入り削除の引数を修正  
   - `removeFavoriteRecipe` には `{ uid, recipeId }` を渡す。  
   - ローカル state のフィルタも同じキー（`id` または 正規化後の `recipeId`）で行う。
3. UI が即時更新されることを確認  
   - Firestore 呼び出し成功後に state が更新され、カードが即時消えるようにする。

---

## ✅ 完成条件（チェックリスト）

- [ ] お気に入り削除がエラーなく実行され、UI からカードが即時に消える  
- [ ] お気に入りリンク/キー/削除判定が Firestore の `id` と一致している（`recipeId` に依存しない）  
- [ ] 履歴の日付表示が Firestore の `date` と一致している（`cookedDate` に依存しない）  
- [ ] ローディング、リダイレクト、空状態、ログアウト挙動は従来通り維持

---

## 🔍 動作確認のしかた

1. `/mypage` を開き、ローディング後にお気に入り・履歴が表示されることを確認  
2. お気に入りカードの削除を押下し、即座に UI から消えることを確認（Firestore にも反映されていること）  
3. 履歴が Firestore の `date` を表示していることを確認  
4. ログアウトボタンで `/login` へ遷移することを確認（退行がないこと）

---

## メモ

- Firestore のお気に入り/履歴は `id`/`date` キーで保存される。UI で別名を使う場合は取得後に正規化してから一貫して参照すること。***
