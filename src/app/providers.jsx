// src/app/providers.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

// AuthContextの作成
const AuthContext = createContext({
  user: null,
  loading: true,
  signOut: async () => {},
});

// useAuthフックのエクスポート
export const useAuth = () => useContext(AuthContext);


// 保護されたルートのリスト（未ログイン時にリダイレクトするパス）
const PROTECTED_ROUTES = ["/ingredients", "/recipes", "/mypage"];

export function AppProviders({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // usePathnameは現状では使用していませんが、将来的な拡張（リダイレクト制御など）のために取得しておきます
  const pathname = usePathname();

  useEffect(() => {
    // Firebase Authの状態監視
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // サインアウト関数
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// ルートガードコンポーネント
export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // ローディング完了後、未ログインかつ保護されたルートへのアクセスならリダイレクト
    if (!loading && !user && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" role="status">
        <Spinner className="size-10 text-orange-500" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // 未ログインで保護ページにいる場合は何も表示しない（リダイレクト待ち）
  if (!user && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return null;
  }

  return children;
  
}