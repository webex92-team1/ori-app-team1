# Issue #6: RakutenレシピAPIクライアントを実装

作業ブランチ：feature/issue-6-rakuten-api-client

## 🎯 このタスクの目的

楽天レシピのキーワード検索 API を叩く関数を作成し、UI 層がモックではなく実データを扱えるようにします。

---

## 📁 作業で触るファイル

- `src/lib/recipes.js`（新規作成）

⚠️ **以下のファイルは触らない**

- `src/lib/mockdata.js`
- `src/app/recipes/page.jsx`
- `src/app/recipes/[id]/page.jsx`

---

## 🌲 作業を始めるとき

作業ブランチに移動する

```bash
git checkout -b feature/issue-6-rakuten-api-client
```

---

## 🧩 作業内容（やること）

1. `src/lib/recipes.js` を新規作成
2. `searchRecipesByIngredients(ingredients: string[])` を実装
   - 楽天レシピの検索 API を叩く
   - `applicationId` と `format=json` をクエリに付ける
3. `getRecipeDetail(recipeId)` を実装
   - 詳細 API を叩き、材料と手順を含むオブジェクトに正規化
4. `AbortController` を受け取ってキャンセルできるようにする
5. ネットワークエラー時は `mockRecipes` をフォールバックとして返す

---

## ✅ 完成条件（チェックリスト）

- [ ] `searchRecipesByIngredients` が楽天レシピ API をリクエストし、レシピ配列を返す
- [ ] `getRecipeDetail` が詳細 API を叩き、材料・手順を含むオブジェクトを返す
- [ ] 両 API が `AbortController` を受け取ってキャンセルできる
- [ ] ネットワークエラー時は `mockRecipes` をフォールバックとして返す
- [ ] API キーは `NEXT_PUBLIC_RAKUTEN_APP_ID` から読み込む

---

## 🔍 動作確認のしかた

1. `.env.local` に `NEXT_PUBLIC_RAKUTEN_APP_ID` を設定
2. 以下のコマンドでテストする：

```bash
node --env-file=.env.local -e "import('./src/lib/recipes.js').then(async (m)=>{const recipes=await m.searchRecipesByIngredients(['卵','玉ねぎ']); console.log(recipes[0]); process.exit(0);})"
```

3. レスポンスがオブジェクト配列で返ることを確認
4. 同様に `getRecipeDetail(recipes[0].recipeId)` を呼び、材料と手順が含まれていることを確認

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: -
- このタスクが終わったら進められるもの: #8, #9
- ラベル: `frontend`, `hook`

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "feat: RakutenレシピAPIクライアントを実装"`
3. `git push origin feature/issue-6-rakuten-api-client`
4. GitHub上でPRを作成

---

## 💡 ちょっとしたヒント

- 楽天レシピ API エンドポイント: `https://app.rakuten.co.jp/services/api/Recipe/KeywordSearch/20170426`
- `fetch` の使い方: `fetch(url, { signal: controller.signal })`
- フォールバック: `try { ... } catch(err) { return mockRecipes; }`

---

## 💬 メモ・質問（必要なら）

- 楽天レシピ API のアプリ ID はチームで共有してください

