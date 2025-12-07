"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUserProfile,
  removeFavoriteRecipe,
} from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Home,
  User,
  Heart,
  Clock,
  Trash2,
  LogOut,
  Loader2,
} from "lucide-react";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        fetchData(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // getUserProfileからデータを取得
  const fetchData = async (uid) => {
    try {
      const profile = await getUserProfile(uid);
      
      if (profile) {
        // favoritesとhistoriesを正規化
        const normalizedFavorites = (profile.favorites || []).map((item) => ({
          ...item,
          recipeId: item.id,
        }));

        const normalizedHistory = (profile.histories || []).map((item) => ({
          ...item,
          recipeId: item.id,
          cookedDate: item.date,
        }));

        setFavorites(normalizedFavorites);
        setHistory(normalizedHistory);
      }
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  // お気に入り削除
  const handleDeleteFavorite = async (recipeId) => {
    if (!user) return;

    const previousFavorites = [...favorites];
    setFavorites((prev) => prev.filter((fav) => fav.recipeId !== recipeId));

    try {
      await removeFavoriteRecipe({ uid: user.uid, recipeId });
    } catch (error) {
      console.error("削除に失敗しました:", error);
      setFavorites(previousFavorites);
      alert("削除に失敗しました。");
    }
  };

  // ログアウト
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ChefHat className="h-6 w-6" />
            <span>FoodMatch</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-slate-600 hover:text-orange-500"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                ホーム
              </Link>
            </Button>
            <Button
              variant="ghost"
              asChild
              className="text-slate-600 hover:text-orange-500"
            >
              <Link href="/ingredients">
                <ChefHat className="h-4 w-4 mr-2" />
                レシピ検索
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                マイページ
              </h1>
              <p className="text-slate-500 text-sm">{user.email}</p>
            </div>
          </div>
        </section>

        {/* Favorites Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-red-500" />
            <h2 className="text-xl font-bold text-slate-900">お気に入りレシピ</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
              {favorites.length}件
            </Badge>
          </div>

          {favorites.length === 0 ? (
            <Card className="border-none shadow-md bg-white">
              <CardContent className="py-10 text-center text-slate-400">
                <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>お気に入りはまだありません</p>
                <Link href="/ingredients">
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                    レシピを探す
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map((fav) => (
                <Card
                  key={fav.recipeId}
                  className="border-none shadow-md bg-white overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 flex gap-4">
                    {fav.image && (
                      <img
                        src={fav.image}
                        alt={fav.title}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 line-clamp-2 mb-1">
                        {fav.title}
                      </h3>
                      <p className="text-xs text-slate-400">
                        保存日: {fav.savedAt || "不明"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteFavorite(fav.recipeId)}
                      className="text-slate-400 hover:text-red-500 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* History Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold text-slate-900">調理履歴</h2>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
              {history.length}件
            </Badge>
          </div>

          {history.length === 0 ? (
            <Card className="border-none shadow-md bg-white">
              <CardContent className="py-10 text-center text-slate-400">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>履歴はまだありません</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-4">
                <ul className="divide-y divide-slate-100">
                  {history.map((item, index) => (
                    <li key={index} className="py-3 flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-slate-800 line-clamp-1">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-sm text-slate-400 shrink-0">
                        {item.cookedDate || "日付不明"}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Logout Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-slate-300 text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} FoodMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}