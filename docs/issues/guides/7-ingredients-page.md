# Issue #7: 食材入力ページで検索条件を保持して遷移

作業ブランチ：feature/issue-7-ingredients-page

## 🎯 このタスクの目的

`/ingredients` ページを `useAuth` で保護し、入力済み食材を検索クエリとして `/recipes` へ渡すまでのロジックを実装します。

---

## 📁 作業で触るファイル

- `src/app/ingredients/page.jsx`

⚠️ **以下のファイルは触らない**

- `src/app/recipes/page.jsx`
- `src/lib/mockdata.js`
- `src/app/mypage/page.jsx`
- `src/lib/firebase.js`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-7-ingredients-page
```

---

## 🧩 作業内容（やること）

1. `useAuth()` を使い、`loading` 時はローディング UI、未ログイン時は `/login` へリダイレクト
2. 「レシピを探す」ボタンで `/recipes?ingredients=卵%20玉ねぎ` のように遷移
3. 入力した食材リストを `localStorage` に保存し、ページ再訪時に復元
4. 食材が 0 件のときはエラーメッセージを表示し遷移しない

---

## ✅ 完成条件（チェックリスト）

- [ ] `useAuth()` で未ログイン時は `/login` にリダイレクトする
- [ ] 「レシピを探す」で `/recipes?ingredients=...` に遷移する
- [ ] 入力した食材リストを `localStorage` に保存し、再訪時に復元する
- [ ] 食材が 0 件のときはエラーメッセージを表示し遷移しない
- [ ] ショートカットボタン/Enter キーでの追加処理が動作する

---

## 🔍 動作確認のしかた

1. ログイン後に `http://localhost:3000/ingredients` を開く
2. 食材を追加せずに検索ボタンを押し、エラーメッセージが表示されることを確認
3. 「卵 玉ねぎ」を入力して検索し、`/recipes?ingredients=...` へ遷移することを確認
4. ブラウザをリロードしても直前の食材リストが復元されていることを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #2
- このタスクが終わったら進められるもの: #8
- ラベル: `frontend`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: 食材入力ページで検索条件を保持して遷移"`
3. `git push origin feature/issue-7-ingredients-page`
4. GitHub 上で PR を作成

---

## 💡 ちょっとしたヒント

- `useAuth()` は `src/app/providers.jsx` で定義されている
- URL エンコード: `encodeURIComponent(list.join(" "))`
- `localStorage` の使い方: `localStorage.setItem('key', JSON.stringify(data))`、`JSON.parse(localStorage.getItem('key'))`
- Next.js の画面遷移: `useRouter()` の `router.push()`

---

## 💬 メモ・質問（必要なら）

- localStorage はブラウザのストレージなので、プライベートブラウジングでは動作しない場合があります
