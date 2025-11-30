// src/app/login/page.jsx
"use client"; // クライアントコンポーネントとして実行

import Link from "next/link";
import { useRouter } from "next/navigation"; // 画面遷移用
import { useState } from "react"; // 状態管理用
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  isSignInWithEmailLink,
} from "firebase/auth"; // Firebase認証関数
// authインスタンスとgoogleProviderは src/lib/firebase からエクスポートされていると仮定
import { auth, googleProvider } from "@/lib/firebase"; 

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Mail, Lock, Loader2 } from "lucide-react"; // Loader2 (スピナー)を追加

// Firebaseエラーコードに対応する日本語メッセージを返す関数
const getFirebaseAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "メールアドレスまたはパスワードが違います。";
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません。";
    case "auth/user-disabled":
      return "このアカウントは無効化されています。";
    case "auth/too-many-requests":
      return "認証の試行回数が多すぎます。しばらくしてからお試しください。";
    case "auth/popup-closed-by-user":
      return "認証ウィンドウが閉じられました。";
    default:
      return "ログインに失敗しました。しばらくしてから再度お試しください。";
  }
};

export default function LoginPage() {
  const router = useRouter();
  
  // フォーム入力値
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // ローディング状態 (メールとGoogleで分離)
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // エラーメッセージ
  const [error, setError] = useState(null);

  // --- 1. メール/パスワード認証 ---
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setError(null);

    try {
      // signInWithEmailAndPassword を呼ぶ
      await signInWithEmailAndPassword(auth, email, password);
      
      // 5. 成功時は /ingredients へ遷移
      router.push("/ingredients");
      
    } catch (err) {
      // 3. エラーコードごとに日本語メッセージを表示
      const message = getFirebaseAuthErrorMessage(err.code);
      setError(message);
    } finally {
      setEmailLoading(false);
    }
  };

  // --- 4. Google認証 ---
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      // signInWithPopup(googleProvider) を呼ぶ
      await signInWithPopup(auth, googleProvider);
      
      // 5. 成功時は /ingredients へ遷移
      router.push("/ingredients");
      
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        // 3. エラーコードごとに日本語メッセージを表示
        const message = getFirebaseAuthErrorMessage(err.code);
        setError(message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* --- Header (変更なし) --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ChefHat className="h-6 w-6" />
            <span>FoodMatch</span>
          </Link>
          <Button
            variant="ghost"
            asChild
            className="text-slate-600 hover:text-orange-500"
          >
            <Link href="/">ホームへ戻る</Link>
          </Button>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-none shadow-xl bg-white">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-slate-900">
              ログイン
            </CardTitle>
            <CardDescription className="text-slate-500">
              アカウントにログインしてください
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* エラー表示エリア */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-md">
                <p className="text-sm text-red-600 font-medium">
                  {error}
                </p>
              </div>
            )}
            
            {/* --- Email & Password Form --- */}
            {/* handleEmailLoginをフォームのonSubmitに設定 */}
            <form onSubmit={handleEmailLogin} className="space-y-4"> 
              {/* Email Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  メールアドレス
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@foodmatch.com"
                    className="pl-10 h-11 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                    value={email} // 状態と連携
                    onChange={(e) => setEmail(e.target.value)} // 状態更新
                    disabled={emailLoading || googleLoading} // ローディング中は無効化
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    パスワード
                  </Label>
                  {/* パスワードリセット機能はコメントアウトのまま */}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                    required
                    value={password} // 状態と連携
                    onChange={(e) => setPassword(e.target.value)} // 状態更新
                    disabled={emailLoading || googleLoading} // ローディング中は無効化
                  />
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
                disabled={emailLoading || googleLoading} // 2. 送信中は disabled にする
              >
                {/* 2. 送信中はスピナーを表示 */}
                {emailLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>

            {/* --- Divider --- */}
            <div className="relative">
              <Separator className="bg-slate-200" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-500">
                または
              </span>
            </div>

            {/* --- Google Login Button --- */}
            <Button
              variant="outline"
              className="w-full h-11 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full font-semibold"
              onClick={handleGoogleLogin} // 4. onClick時にsignInWithPopup()を実行
              disabled={emailLoading || googleLoading} // 進行中は無効化
            >
              {/* 4. Googleログイン進行中はスピナーを表示 */}
              {googleLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-slate-500" />
              ) : (
                <svg
                  className="mr-2 h-5 w-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Googleでログイン
            </Button>

            {/* --- Signup Link (変更なし) --- */}
            <div className="text-center pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-600">
                アカウントをお持ちでない方は{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-orange-500 hover:text-orange-600 hover:underline"
                >
                  新規登録
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}