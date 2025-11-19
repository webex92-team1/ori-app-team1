### フェーズ構成
- フェーズ1: Firebase基盤構築（#1-#3） / 認証・Firestoreを扱うための初期化とデータアクセス層を整え、後続実装が同じ土台を共有できるようにします。
- フェーズ2: 認証フロー接続（#4-#5） / 実ユーザーがメール or Google でサインアップ・ログインできるようにし、保護ページに進める状態を作ります。
- フェーズ3: レシピ検索垂直スライス（#6-#8） / 食材入力→Rakuten API検索→レシピ一覧のフローを接続し MVP の中核を成立させます。
- フェーズ4: 個人データ連携（#9-#10） / レシピ詳細でのお気に入り・履歴操作とマイページ表示を Firestore ドキュメントと同期させます。
- フェーズ5: セキュリティ強化（#11） / 認証済みユーザーのみが自身の `users/{uid}` にアクセスできるよう Firestore ルールを確定させます。

### 依存関係マップ
#1 → #2 → #4/#5/#7/#8/#9/#10
#1 → #3 → #4/#9/#10/#11
#6 → #8 → #9
#7 → #8
#9 → #10

#### Issue アウトライン表
##### Issue #1: Firebaseクライアント初期化モジュールを作成
**概要**: 環境変数から Firebase 設定を読み込み、Auth / Firestore を初期化する1ファイルのユーティリティを追加して以降の機能から共有できるようにします。
**優先度**: P1
**依存**: -
**ラベル**: `infra`, `firestore`
**編集するファイル**:
- `src/lib/firebase.js`
**変更しないファイル**:
- `src/app/layout.jsx`
- `src/app/login/page.jsx`
- `src/lib/mockdata.js`
**受け入れ基準（AC）**:
- `src/lib/firebase.js` が `initializeApp` を `getApps()` で多重初期化を避けつつ実行し、`auth`, `db`, `googleProvider` をエクスポートしている。
- 必須の Firebase 環境変数が存在しない場合は throw / console.error で即座に気付ける。
- `NEXT_PUBLIC_FIREBASE_*` を参照するコードがサーバー側レンダリングでも落ちないようガードしている。
- `npm run lint` がエラー無く完了する。
**検証手順（手動）**:
1. `.env.local` に Firebase の公開キー群を入力する。
2. `npm run dev` を実行し、`http://localhost:3000/login` を表示する。
3. ブラウザコンソールに `Firebase: No Firebase App` などの初期化エラーが出ていないことを確認する。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

##### Issue #2: AuthProviderとルートガードを追加
**概要**: Firebase Auth の状態をアプリ全体で共有する `AuthProvider` と `RequireAuth` を実装し、保護ページが一貫した挙動でログイン状態を判定できるようにします。
**優先度**: P1
**依存**: #1
**ラベル**: `frontend`, `auth`
**編集するファイル**:
- `src/app/providers.jsx`
- `src/app/layout.jsx`
**変更しないファイル**:
- `src/app/ingredients/page.jsx`
- `src/app/login/page.jsx`
- `src/lib/mockdata.js`
**受け入れ基準（AC）**:
- `src/app/providers.jsx` に `AuthContext` と `useAuth()` が定義され、`{ user, loading, signOut }` を提供している。
- `RequireAuth`（または同等コンポーネント）が `loading` 中はローディング UI を表示し、未ログイン時は `router.push("/login")` で遷移する。
- `signOut` は Firebase Auth の `signOut()` を呼び、グローバル状態が即座に更新される。
- `src/app/layout.jsx` が `AppProviders` で `<body>` をラップし、既存のフォント設定や `suppressHydrationWarning` を壊さない。
- ローディング UI は `role="status"` 付きのスピナーで、スクリーンリーダーに進捗が伝わる。
**検証手順（手動）**:
1. `npm run dev` を起動し `http://localhost:3000/login` を表示する。
2. React DevTools で `AuthProvider` を確認し、初期表示で `loading:true` → 数ms後に `false` へ変わることを確認する。
3. ブラウザコンソールで `window.firebase` などの未定義参照エラーが出ていないことを確認する。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

##### Issue #3: Firestoreデータアクセサ群の実装
**概要**: `users/{uid}` ドキュメントを読み書きするヘルパー関数群を1ファイルにまとめ、各ページが生APIを直接叩かなくて済むようにします。
**優先度**: P1
**依存**: #1
**ラベル**: `firestore`, `infra`
**編集するファイル**:
- `src/lib/firestore.js`
**変更しないファイル**:
- `src/app/signup/page.jsx`
- `src/app/recipes/[id]/page.jsx`
- `src/app/mypage/page.jsx`
**受け入れ基準（AC）**:
- `createUserProfile({ uid, email, name })` が `favorites: []`, `histories: []`, `createdAt` を含む初期ドキュメントを作成する。
- `getUserProfile(uid)` が Firestore から取得したデータをアプリ用の型に正規化し、存在しない場合は `null` を返す。
- `upsertFavoriteRecipe({ uid, recipe })` と `removeFavoriteRecipe({ uid, recipeId })` が配列で重複しないように更新する。
- `addHistoryEntry({ uid, recipe })` が `date-fns` を使って `YYYY-MM-DD` 文字列を付与し、新しい履歴を先頭に追加する。
- すべての関数が Firestore 例外を `console.error` + 自前の `Error` でラップし、呼び出し側がハンドリングできる。
**検証手順（手動）**:
1. Firebase Emulator もしくは本番プロジェクトに接続し、`firebase emulators:start --only firestore` を起動する。
2. 新しい端末で `node --env-file=.env.local -e "import('./src/lib/firestore.js').then(async (m)=>{await m.createUserProfile({uid:'dev-test',email:'dev@example.com',name:'Dev'}); console.log(await m.getUserProfile('dev-test')); process.exit(0);})"` を実行する。
3. Emulator UI / Firebase Console で `users/dev-test` に `favorites` / `histories` フィールドが意図通り設定されていることを確認する。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

##### Issue #4: サインアップフォームをFirebase Authに接続
**概要**: `/signup` のフォーム送信時に Firebase Auth / Firestore を呼び出し、新規ユーザーを作成して食材入力ページへ遷移できるようにします。
**優先度**: P1
**依存**: #2, #3
**ラベル**: `frontend`, `auth`
**編集するファイル**:
- `src/app/signup/page.jsx`
**変更しないファイル**:
- `src/app/login/page.jsx`
- `src/lib/mockdata.js`
- `src/app/ingredients/page.jsx`
**受け入れ基準（AC）**:
- フォーム送信時に `createUserWithEmailAndPassword` を呼び、成功時は `createUserProfile` で Firestore にドキュメントを作成する。
- 送信中はボタンを disabled にし、`Spinner` や「登録中…」のテキストを表示する。
- Email 形式エラーとパスワード桁数不足時にフォーム下へエラーメッセージが表示される。
- Firebase API からのエラーは日本語メッセージに変換してフォーム上部で表示する。
- 成功後は `/ingredients` へ `router.push` し、`AuthProvider` によって状態がログイン済みになる。
**検証手順（手動）**:
1. `npm run dev` を起動し `http://localhost:3000/signup` を開く。
2. 空入力で送信し、バリデーションエラーが表示されることを確認する。
3. ダミーのメール・パスワードで送信し、スピナー表示→`/ingredients` へ遷移することを確認する。
4. Firebase Console/Emulator で新しい `users/{uid}` ドキュメントが作成されていることを確認する。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

##### Issue #5: ログインページでメール/Google認証を実装
**概要**: `/login` からメール＋パスワード、Google OAuth の両方でサインインできるようにし、エラー表示とローディング制御を追加します。
**優先度**: P1
**依存**: #2
**ラベル**: `frontend`, `auth`
**編集するファイル**:
- `src/app/login/page.jsx`
**変更しないファイル**:
- `src/app/signup/page.jsx`
- `src/app/layout.jsx`
- `src/lib/mockdata.js`
**受け入れ基準（AC）**:
- メールフォーム送信時に `signInWithEmailAndPassword` を呼び、送信中はボタンが disabled になる。
- エラーコードごとに「メールまたはパスワードが違います」などのメッセージを表示する。
- 「Googleでログイン」ボタンが `signInWithPopup(googleProvider)` を呼び、進行中は `Spinner` を表示する。
- 成功時は `/ingredients` へ遷移し、`AuthProvider` の `user` が即時更新される。
- サインイン後に `AuthProvider` 経由で得られる `signOut` を呼ぶ UI はまだ不要だが、`console.error` が出ていないこと。
**検証手順（手動）**:
1. #4 で作成したアカウントで `/login` から誤ったパスワードを入力し、エラーメッセージが表示されることを確認する。
2. 正しいパスワードでログインし、`/ingredients` に遷移することを確認する。
3. Google ログインボタンを押し、ポップアップが開き認証後に `/ingredients` へ戻ることを確認する（テスト用プロジェクトでOK）。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

##### Issue #6: RakutenレシピAPIクライアントを実装
**概要**: 楽天レシピのキーワード検索 API を叩く `searchRecipesByIngredients` / `getRecipeDetail` ユーティリティを追加し、UI 層がモックではなく実データを扱えるようにします。
**優先度**: P1
**依存**: -
**ラベル**: `frontend`, `hook`
**編集するファイル**:
- `src/lib/recipes.js`
**変更しないファイル**:
- `src/lib/mockdata.js`
- `src/app/recipes/page.jsx`
- `src/app/recipes/[id]/page.jsx`
**受け入れ基準（AC）**:
- `searchRecipesByIngredients(ingredients: string[])` が `https://app.rakuten.co.jp/services/api/Recipe/KeywordSearch/20170426` に `applicationId` と `format=json` を付けてリクエストする。
- `getRecipeDetail(recipeId)` が詳細 API を叩き、`recipeMaterial` / `recipeInstructions` を含むオブジェクトに正規化する。
- 両 API が `AbortController` を受け取ってキャンセルできる。
- ネットワークエラー時は `mockRecipes` をフォールバックとして返し、UI 側で例外にならない。
- API キーは `NEXT_PUBLIC_RAKUTEN_APP_ID` から読み込み、存在しない場合は descriptive error を投げる。
**検証手順（手動）**:
1. `.env.local` に `NEXT_PUBLIC_RAKUTEN_APP_ID` を設定する。
2. `node --env-file=.env.local -e "import('./src/lib/recipes.js').then(async (m)=>{const recipes=await m.searchRecipesByIngredients(['卵','玉ねぎ']); console.log(recipes[0]); process.exit(0);})"` を実行し、レスポンスがオブジェクト配列で返ることを確認する。
3. 同様に `getRecipeDetail(recipes[0].recipeId)` を呼び、材料と手順が含まれていることを確認する。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

##### Issue #7: 食材入力ページで検索条件を保持して遷移
**概要**: `/ingredients` を `useAuth` で保護し、入力済み食材を検索クエリとして `/recipes` へ渡すまでのロジックを実装します。
**優先度**: P1
**依存**: #2
**ラベル**: `frontend`
**編集するファイル**:
- `src/app/ingredients/page.jsx`
**変更しないファイル**:
- `src/app/recipes/page.jsx`
- `src/lib/mockdata.js`
- `src/app/mypage/page.jsx`
**受け入れ基準（AC）**:
- `useAuth()` を使い、`loading` 時はローディング UI、未ログイン時は `/login` へリダイレクトする。
- 「レシピを探す」アクションで `router.push(`/recipes?ingredients=${encodeURIComponent(list.join(" "))}`)` を実行する。
- 入力した食材リストを `localStorage` に保存し、ページ再訪時に復元する。
- 食材が 0 件のときはエラー toast もしくはメッセージを表示し遷移しない。
- ショートカットボタン/Enterキーでの追加処理は現行 UI を保ったまま動作する。
**検証手順（手動）**:
1. ログイン後に `http://localhost:3000/ingredients` を開く。
2. 食材を追加せずに検索ボタンを押し、エラーメッセージが表示され遷移しないことを確認する。
3. 「卵 玉ねぎ」を入力して検索し、`/recipes?ingredients=%E5%8D%B5%20%E7%8E%89%E3%81%AD%E3%81%8E` へ遷移することを確認する。
4. ブラウザをリロードしても直前の食材リストが復元されていることを確認する。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

##### Issue #8: レシピ一覧ページでRakuten APIを表示
**概要**: `/recipes` ページを検索クエリに応じて `searchRecipesByIngredients` を呼び出す実装に置き換え、ローディング／エラー／空状態を制御します。
**優先度**: P1
**依存**: #2, #6, #7
**ラベル**: `frontend`
**編集するファイル**:
- `src/app/recipes/page.jsx`
**変更しないファイル**:
- `src/app/recipes/[id]/page.jsx`
- `src/lib/mockdata.js`
- `src/app/ingredients/page.jsx`
**受け入れ基準（AC）**:
- `useSearchParams` で `ingredients` クエリを読み、存在しない場合は「食材を入力してください」の空状態を表示する。
- `useEffect` + `AbortController` で API を呼び、取得完了まで骨組みのローディングカードを表示する。
- ネットワークエラー時はトーストかエラーカードを表示し、フォールバックデータ（mock）で画面が崩れない。
- カテゴリフィルターは API レスポンスに対して機能し、選択中はUIに強調スタイルが付く。
- カードクリックで `/recipes/[id]` に遷移し、ingredientsクエリは `router.push` で維持する。
**検証手順（手動）**:
1. `/ingredients` から「卵 玉ねぎ」で検索し `/recipes` に遷移する。
2. ローディングスケルトン→レシピカードが表示されることを確認する。
3. 存在しない食材（例: `xyz`) で検索し、0 件メッセージが表示されることを確認する。
4. 開発者ツールでネットワークを Offline にし再読み込みし、エラーメッセージとフォールバック表示が出ることを確認する。
**分割提案（必要時）**: -
**想定工数**: 1.0 日

##### Issue #9: レシピ詳細ページでお気に入り・履歴を同期
**概要**: `/recipes/[id]` を Rakuten API の詳細データに差し替え、「お気に入り」「作った！」ボタンから Firestore の favorites / histories を更新できるようにします。
**優先度**: P2
**依存**: #2, #3, #6, #8
**ラベル**: `frontend`, `firestore`
**編集するファイル**:
- `src/app/recipes/[id]/page.jsx`
**変更しないファイル**:
- `src/app/recipes/page.jsx`
- `src/app/mypage/page.jsx`
- `src/lib/mockdata.js`
**受け入れ基準（AC）**:
- パラメータ `id` を使って `getRecipeDetail` を呼び、読み込み完了までスケルトンを表示する。
- レシピが存在しない場合は 404 UI + `/recipes` への導線を表示する。
- 「お気に入り」ボタンが Firestore の favorites に追加/削除し、状態に応じてラベル/色を切り替える。
- 「作った！」ボタンで `addHistoryEntry` を呼び、同一日重複は抑止する。
- 書き込み中は各ボタンを disabled にし、成功/失敗を toast (sonner) で通知する。
**検証手順（手動）**:
1. `/recipes` から任意のカードをクリックして詳細ページを開く。
2. ローディング→詳細表示が切り替わることを確認する。
3. 「お気に入り」ボタンを押し、Firebase Console の `favorites` 配列にレシピIDが追加されることを確認する。
4. 「作った！」ボタンを押し、`histories` に日付付きで追加されることを確認する。同じ日に再度押すとトーストで拒否されることを確認する。
**分割提案（必要時）**: -
**想定工数**: 1.0 日

##### Issue #10: マイページでお気に入り・履歴を表示
**概要**: `/mypage` を Firestore の `users/{uid}` と同期させ、リアルタイムにお気に入り・履歴を表示/削除できるようにします。
**優先度**: P2
**依存**: #2, #3, #9
**ラベル**: `frontend`, `firestore`
**編集するファイル**:
- `src/app/mypage/page.jsx`
**変更しないファイル**:
- `src/app/recipes/[id]/page.jsx`
- `src/lib/mockdata.js`
- `src/app/ingredients/page.jsx`
**受け入れ基準（AC）**:
- `useAuth()` でログイン状態を確認し、未ログイン時は `/login` にリダイレクトする。
- Firestore からユーザードキュメントを取得する間はスケルトン/ローディングのみを表示する。
- お気に入りカードと履歴リストが Firestore の配列と一致し、0 件時は空状態メッセージを表示する。
- 各お気に入りカードに「削除」アクションを追加し、クリックで `removeFavoriteRecipe` を呼びUIを即時更新する。
- 画面下部の「ログアウト」ボタンが `signOut` を呼んで `/login` へ遷移する。
**検証手順（手動）**:
1. お気に入り/履歴が登録されたアカウントで `/mypage` を開き、ローディング後にデータが表示されることを確認する。
2. お気に入りを削除し、UI と Firestore の両方で消えていることを確認する。
3. 「ログアウト」を押して `/login` に戻り、保護ページへアクセスするとガードされることを確認する。
**分割提案（必要時）**: -
**想定工数**: 1.0 日

##### Issue #11: Firestoreセキュリティルールの整備
**概要**: Firestore への読み書きを `users/{uid}` に限定するルールファイルを追加し、本番デプロイ前の最低限のセキュリティを担保します。
**優先度**: P2
**依存**: #3
**ラベル**: `rules`, `infra`
**編集するファイル**:
- `firebase/firestore.rules`
**変更しないファイル**:
- `src/lib/firestore.js`
- `src/lib/firebase.js`
- `src/app/recipes/[id]/page.jsx`
**受け入れ基準（AC）**:
- `firebase/firestore.rules` に `rules_version = '2'` と `match /users/{uid}` のみを許可するルールが定義されている。
- 認証済みユーザーは自分のドキュメントのみ read/write 可能で、未認証ユーザーは全て reject される。
- ルールファイルの先頭にデプロイコマンド（コメント）が記載されている。
- `firebase emulators:start --only firestore` 実行時にルールが読み込まれ、警告が出ていない。
**検証手順（手動）**:
1. `firebase emulators:start --only firestore` を実行する。
2. Emulator UI で `users/another-user` を読み書きしようとし、認証 UID が一致しない場合に拒否されることを確認する。
3. `firebase deploy --only firestore:rules` を実行し、エラーが発生しないことを確認する（本番反映前のドライランでも可）。
**分割提案（必要時）**: -
**想定工数**: 0.5 日

### 要確認事項
- Rakuten レシピ API で利用予定のエンドポイント（KeywordSearch で問題無いか）と `applicationId` を共有してください。
- Firebase プロジェクト / Emulator のどちらを本番とするか、Google ログインに必要な承認済みドメインが設定済みか確認が必要です。
- Firestore ルールをデプロイするための `firebase` CLI 設定（サービスアカウントやプロジェクトID）がチーム全体で揃っているか確認してください。
