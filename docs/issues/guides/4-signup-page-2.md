# Issue #4: サインアップページ実装ガイド（実装用）

このドキュメントは、`/signup` ページを **Firebase Auth + Firestore + AuthProvider** と連携させるための「手順書」です。  
すでにある UI を崩さずに、以下の完成条件をすべて満たすコードを書いていきます。

---

## 🎯 ゴール（完了条件のおさらい）

`docs/issues/guides/4-signup-page.md` に書かれている完了条件を、実装観点で言い換えると次の通りです。

1. **フォーム送信時に `createUserWithEmailAndPassword` を呼び出す**
2. **成功したら `createUserProfile` で Firestore に `users/{uid}` ドキュメントを作成する**
3. **送信中はボタンを disabled にし、「登録中…」＋スピナーを表示する**
4. **Email 形式エラー & パスワード桁数不足などで、わかりやすい日本語エラーをフォーム上部に表示する**
5. **Firebase エラーコードを日本語メッセージに変換する（例: `auth/email-already-in-use` など）**
6. **成功後は `/ingredients` へ遷移し、`AuthProvider` によってログイン状態と判定される**

以下のステップに沿って、`src/app/signup/page.jsx` を完成させてください。

---

## 0. 事前確認

### 触ってよいファイル
- `src/app/signup/page.jsx`

### 触らないファイル（ガイド通り）
- `src/app/login/page.jsx`
- `src/lib/mockdata.js`
- `src/app/ingredients/page.jsx`
- `src/lib/firebase.js`
- `src/lib/firestore.js`

### すでに実装済みのもの（前提）
- `src/lib/firebase.js`  
  → `auth`, `googleProvider` が export されている
- `src/lib/firestore.js`  
  → `createUserProfile({ uid, email, name })` などのヘルパーが実装済み
- `src/app/providers.jsx`  
  → `onAuthStateChanged(auth, ...)` でログイン状態を監視し、`/ingredients` などを保護している
- `src/app/signup/page.jsx`  
  → すでにこのガイドの最終形にかなり近いコードが書かれています  
  （以下のステップで「どの部分がどの要件を満たしているか」を対応付けて確認する）

---

## 1. フォーム状態とハンドラの追加

### 目的
- 入力値（名前 / メールアドレス / パスワード）、ローディング状態、エラー文言を React の state で管理する。

### やること
1. コンポーネントの冒頭で `useState` と `useRouter` を使う。
2. `formData`, `isLoading`, `error` の 3 つの state を定義。
3. `<Input>` に `value` と `onChange` をつなぐ。

### ポイント
- `handleChange` で `name` 属性を使って汎用的に更新する形にする。
- 例: `setFormData((prev) => ({ ...prev, [name]: value }));`

※ 現在の `signup/page.jsx` にはすでに以下のような実装があります。この形を維持できていれば **このステップは完了済み** とみなしてOKです。

```23:37:src/app/signup/page.jsx
export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
}
```

---

## 2. Firebase エラーコード → 日本語メッセージ変換関数

### 目的
- Firebase の生のエラーコードを、そのままユーザーに見せない。
- Issue にあるように「日本語メッセージ」でフォーム上部に表示する。

### やること
- `signup/page.jsx` の中に `getErrorMessage(errorCode)` 関数を定義し、`switch` 文で主なコードをハンドリングする。

### 対応例
- `auth/email-already-in-use` → 「このメールアドレスは既に使用されています。」
- `auth/invalid-email` → 「メールアドレスの形式が正しくありません。」
- `auth/weak-password` → 「パスワードは6文字以上で入力してください。」

※ 現在のコードにはすでに `getErrorMessage` が実装されています。  
`catch (err)` 内で `setError(getErrorMessage(err.code));` としていれば、このステップも **完了済み** です。

---

## 3. サインアップ処理（メール＋パスワード）

### 目的
- フォーム送信時に以下の順番で処理する：
  1. `createUserWithEmailAndPassword(auth, email, password)`  
  2. `updateProfile` で `displayName` 更新  
  3. `createUserProfile` で Firestore `users/{uid}` 作成  
  4. `/ingredients` へ `router.push`

### 実装の流れ
1. `<form>` に `onSubmit={handleSignup}` を付与。
2. `handleSignup` 内で `e.preventDefault()` を呼ぶ。
3. リクエスト前に `setIsLoading(true)` + `setError("")`。
4. `try` ブロックで `createUserWithEmailAndPassword` → `updateProfile` → `createUserProfile`。
5. 成功したら `router.push("/ingredients")`。
6. `catch` ブロックで `setError(getErrorMessage(err.code))`。
7. `finally` で `setIsLoading(false)`。

### ローディング表現
- 送信中は:
  - サインアップボタン `disabled`
  - ボタンラベルを「登録中…」に変更
  - `Loader2` アイコンなどを回転させる

※ すでに `handleSignup` と `<form onSubmit={handleSignup}>`、`isLoading` 管理が実装されていれば、このステップもほぼ完了です。  
コードを読みながら、**上記の7ステップと一つずつ対応しているか** を確認してください。

---

## 4. エラーメッセージ表示エリア

### 目的
- 完了条件の「エラー時は日本語メッセージでフォーム上部に表示」を満たす。

### やること
- `<CardContent>` 内のフォームの直前に、`error` state を描画するエリアを追加する。
- 例：

```151:157:src/app/signup/page.jsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-md">
    {error}
  </div>
)}
```

### 補足
- バリデーションエラー（空欄、パスワード6文字未満など）は、`required` や `minLength` でブラウザ標準のチェックを使いつつ、Firebase の `auth/weak-password` などは `getErrorMessage` 側で対応する、という役割分担にするとシンプルです。

---

## 5. Google サインアップ（任意だが推奨）

### 目的
- 「Googleで登録」ボタンからも Firebase Auth & Firestore 連携を行う。

### やること
1. `signInWithPopup(auth, googleProvider)` を呼び出す `handleGoogleSignup` 関数を実装。
2. 取得した `user` から `uid`, `email`, `displayName` を取り出し、`createUserProfile` に渡す。
3. 成功したら `/ingredients` へ `router.push`。
4. 失敗したら `setError("Googleログインに失敗しました。")` などで表示。
5. `isLoading` state を共用して、ボタンを `disabled` にしつつスピナーを出す。

※ 現在のコードには `handleGoogleSignup` が実装済みで、上述の流れをほぼ満たしています。  
ボタンに `onClick={handleGoogleSignup}` と `disabled={isLoading}` が付いているか確認してください。

---

## 6. ボタンの disabled 制御と UI 仕上げ

### 目的
- 完了条件「送信中はボタンを disabled にし、ローディング表示が出る」をフォーム全体で徹底する。

### やること
- 以下のすべてに `disabled={isLoading}` を付ける：
  - 名前、メール、パスワードの `<Input>`
  - サインアップボタン
  - Googleサインアップボタン
- サインアップボタンのラベルをローディング中だけ変える：

```237:251:src/app/signup/page.jsx
<Button
  type="submit"
  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      登録中...
    </>
  ) : (
    "アカウントを作成する"
  )}
</Button>
```

---

## 7. 動作確認チェックリスト

実装が終わったら、元ガイド `4-signup-page.md` の「動作確認のしかた」に沿って確認してください。  
以下にチェックリスト形式でまとめ直します。

1. `npm run dev` を起動して `http://localhost:3000/signup` を開く。
2. 名前 / メール / パスワードを空のまま送信してみて、ブラウザの必須エラーや、必要であればカスタムメッセージが表示されることを確認。
3. メールアドレスだけ不正な形式にして送信した場合、`auth/invalid-email` 由来の日本語メッセージが上部に表示されること。
4. 短すぎるパスワードで送信した場合、`auth/weak-password` 由来のメッセージ、またはパスワード長バリデーションの説明が表示されること。
5. 正しい形式の `メール + パスワード` を入力して送信したとき：
   - ボタンが「登録中…」＋スピナーに変わる
   - 二重送信できない（ボタンが disabled）
   - 成功後 `/ingredients` に遷移する
6. Firebase Console または Emulator で `users/{uid}` ドキュメントが作成され、
   - `email`, `name`
   - `favorites: []`
   - `histories: []`
   - `createdAt`, `updatedAt`
   が入っていることを確認する。
7. `/ingredients` に直接アクセスしても、`AuthProvider` によりログイン状態と判定されていること（リダイレクトされないこと）を確認する。

---

## 8. 実装の振り返り（受講生向け確認ポイント）

レビュー時には、次の観点でコードを見直してみてください。

- Firebase 周りの処理（Auth, Firestore ヘルパー）は **1か所に閉じ込められているか**  
  - コンポーネント内で生の Firestore API を直接呼びすぎていないか
- 例外処理：
  - `try/catch/finally` でローディング状態の ON/OFF が確実に行われているか
  - 予期しないエラーコードでも、ユーザーにとって意味が分かるメッセージを表示しているか
- ユーザー体験：
  - 二重クリック / 多重送信が防止されているか
  - エラーが起きたとき、どこを直せば良いかが UI から読み取れるか

これらを満たせていれば、`Issue #4: サインアップフォームをFirebase Authに接続` は実装完了とみなせます。おつかれさまでした！


