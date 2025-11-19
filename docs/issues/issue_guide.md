# 🎯 目的

`docs/roadmap.md` に記載された Issue アウトラインをもとに、  
各 Issue の実装ガイド（初心者向けテンプレート形式）を `docs/issues/` 配下に自動生成してください。

---

## 🗂️ 入力情報

- Issue アウトライン: `docs/roadmap.md`
- 設計資料: `docs/` 配下（要件定義書、アーキテクチャ設計、DB 設計、Firebase 呼び出し、サイトマップ）
- 既存のコードベース（src/ 配下）
- 出力形式: Markdown
- 出力は 1Issue ずつ（例: `docs/issues/1-auth-signup.md`）

---

## 🧾 出力フォーマット

各 Issue は、以下のテンプレートに**忠実に**従って生成してください。

```md
filename=docs/issues/{{ISSUE_NUMBER}}-{{kebab-case-title}}.md

# Issue #{{ISSUE_NUMBER}}: {{やること（短く）}}

作業ブランチ：feature/issue-{{ISSUE_NUMBER}}-{{kebab-case-title}}

## 🎯 このタスクの目的

（1〜2 文で、この作業で何ができるようになるか説明）

---

## 📁 作業で触るファイル

- `src/.../{{ファイル名}}`

⚠️ **以下のファイルは触らない**

- `src/firebase.js`
- `src/main.jsx`
- `src/styles/global.css`

---

## 🌲 作業を始めるとき

作業ブランチに移動する
`git checkout -b feature/issue-{{ISSUE_NUMBER}}-{{kebab-case-title}}`

---

## 🧩 作業内容（やること）

1. （具体的な作業内容を 1〜3 ステップで）
2. （例：「入力フォームを作る」「送信ボタンを追加する」など）

---

## ✅ 完成条件（チェックリスト）

- [ ] この画面で動作を確認できる（パス: `/xxx`）
- [ ] 入力後に Firestore/Auth でデータが反映される
- [ ] エラーが出ず、画面遷移またはメッセージが表示される
- [ ] UI がデザイン通りに見える（必要なら）

---

## 🔍 動作確認のしかた

1. ローカルでアプリを起動（`npm run dev`）
2. `/{{ページ名}}` にアクセス
3. （操作手順）
4. Firestore のデータ or 画面変化を確認して OK！

---

## 🔗 関連・順番

- このタスクの前に終わっている必要がある: #{{依存番号 or -}}
- このタスクが終わったら進められるもの: #{{次の番号 or -}}
- ラベル: `frontend`, `firestore`, `auth`, `ui` など

---

## 🌲 作業が完了したら

1. `git add .`
2. `git commit -m "何を変更したか一言で"`
3. `git push origin {{ブランチ名}}`
4. github 上で PR を作成

---

## 💡 ちょっとしたヒント

（例：使う関数名、参考ファイル、Firebase の関数、関連 Hook 名など）

---

## 💬 メモ・質問（必要なら）

- （わからない点や相談したいことを書いて OK）
```

---

## 🧠 出力ルール

1. `docs/roadmap.md` に書かれている Issue の順番で 1 つずつ生成する
2. 各 Issue に含まれる情報（依存・AC・担当範囲など）を読み取り、テンプレに落とし込む
3. 編集対象ファイルを **既存コード構成（src 配下）に基づいて明記**
4. 触ってはいけないファイル（firebase.js など）も毎回含める
5. Firestore / Auth を利用するタスクでは、**実際に使う関数名をヒントに記載**
6. 出力は **1 Issue = 1 Markdown コードブロック**
7. コードブロック外に一切の説明を出さない（自動生成しやすくするため）

---

## 🧩 生成手順（Codex 内部思考用・出力禁止）

1. `docs/roadmap.md` を読み、Issue 番号・タイトル・概要・依存関係・AC を抽出
2. 各 Issue に対して、実装対象ファイルを src/構造と対応づける
3. 初心者が迷わない言葉に変換（難しい技術用語を避ける）
4. チェックリスト（AC）を 4〜6 項目に整形
5. ファイル名を `docs/issues/{{ISSUE_NUMBER}}-{{kebab-case-title}}.md` で出力

---

## ✅ 出力イメージ（例）

```md
filename=docs/issues/1-auth-signup.md

# Issue #1: メールアドレスで新規登録できるようにする

## 🎯 このタスクの目的

ユーザーがメールアドレスとパスワードでアカウントを作れるようにする。

---

## 📁 作業で触るファイル

- `src/hooks/useSignup.js`

⚠️ **以下のファイルは触らない**

- `src/firebase.js`
- `src/main.tsx`
- `src/styles/global.css`

---

## 🧩 作業内容（やること）

1. Firebase Auth の `createUserWithEmailAndPassword` を呼び出す処理を作成
2. 成功時に `/home` に遷移する
3. 失敗時はエラーメッセージを表示する

---

## ✅ 完成条件（チェックリスト）

- [ ] 入力フォームで登録できる
- [ ] Firebase Auth にユーザーが追加される
- [ ] 成功時に `/home` へ遷移
- [ ] 無効な入力時にエラー表示

---

## 🔍 動作確認のしかた

1. `/signup` にアクセス
2. メール・パスワードを入力
3. 「登録」ボタンを押す
4. Firebase Auth で登録確認できる

---

## 🔗 関連・順番

- 前提: #0 Firebase 初期設定
- 次: #2 ログイン機能
- ラベル: `auth`, `frontend`

---

## 💡 ちょっとしたヒント

- 関数: `createUserWithEmailAndPassword(auth, email, password)`
- 画面遷移: `useNavigate()` を使用
```
