// src/app/mypage/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers"; // Issue #2 で作成した AuthProvider
import { getUserProfile, removeFavoriteRecipe } from "@/lib/firestore"; // Issue #3 で作成した Firestore ヘルパー
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  ChefHat,
  Home,
  User,
  Settings,
  LogOut,
  Heart,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  History,
  Calendar,
} from "lucide-react";

export default function MyPage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // プロフィールデータの取得
  useEffect(() => {
    const fetchProfile = async () => {
      // useAuth の loading が完了しても user が null の場合は
      // RequireAuth によってリダイレクトされるため、ここでは user がある場合のみ処理
      if (!user) return;

      try {
        const data = await getUserProfile(user.uid);
        setProfile(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("プロフィールの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // お気に入り削除処理
  const handleRemoveFavorite = async (e, recipe) => {
    e.preventDefault(); // リンク遷移を防止
    e.stopPropagation();

    if (!user) return;

    try {
      // Firestoreから削除
      await removeFavoriteRecipe({ uid: user.uid, recipe });
      
      // ローカルのstateを更新（再取得せず即時反映）
      setProfile((prev) => ({
        ...prev,
        favorites: prev.favorites.filter((fav) => fav.recipeId !== recipe.recipeId),
      }));

      toast.success("お気に入りから削除しました");
    } catch (error) {
      console.error("Remove favorite error:", error);
      toast.error("削除に失敗しました");
    }
  };

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("ログアウトしました");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("ログアウトに失敗しました");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner className="size-10 text-orange-500" />
      </div>
    );
  }

  // プロフィールがない場合（通常はありえないが念のため）
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <p className="text-slate-500 mb-4">ユーザーデータが見つかりません</p>
        <Button onClick={() => window.location.reload()}>再読み込み</Button>
      </div>
    );
  }

  const { favorites = [], histories = [] } = profile;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* --- Header --- */}
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
              className="text-orange-500 bg-orange-50 hover:bg-orange-100 hover:text-orange-600 pointer-events-none"
            >
              <User className="h-4 w-4 mr-2" />
              マイページ
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-xl">
        {/* --- Profile Section --- */}
        <Card className="mb-8 border-none shadow-md bg-white">
          <CardContent className="flex flex-col items-center p-8">
            <Avatar className="h-24 w-24 mb-4 border-4 border-orange-50">
              {/* Googleログイン等のアイコンがあれば表示 */}
              <AvatarImage src={user.photoURL} alt={profile.name} />
              <AvatarFallback className="bg-orange-100 text-orange-500 text-2xl font-bold">
                {profile.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {profile.name}
            </h2>
            <p className="text-sm text-slate-500 mb-6">{profile.email}</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              プロフィール編集
            </Button>
          </CardContent>
        </Card>

        <Separator className="my-8 bg-slate-200" />

        {/* --- Favorites Section --- */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Heart className="h-5 w-5 text-orange-500 fill-orange-500" />
            お気に入りレシピ
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({favorites.length})
            </span>
          </h3>

          <div className="space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">
                  お気に入りのレシピはまだありません
                </p>
                <Button variant="link" asChild className="text-orange-500 mt-2">
                  <Link href="/recipes">レシピを探す</Link>
                </Button>
              </div>
            ) : (
              favorites.map((recipe) => (
                <Link
                  key={recipe.recipeId}
                  href={`/recipes/${recipe.recipeId}`}
                  className="block"
                >
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group bg-white relative">
                    <div className="flex flex-col sm:flex-row p-3">
                      {/* Image */}
                      <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden rounded-md">
                        <img
                          src={recipe.foodImageUrl || recipe.mediumImageUrl}
                          alt={recipe.recipeTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <CardContent className="flex-1 p-2 flex flex-col justify-between ml-0 sm:ml-2">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors pr-8">
                              {recipe.recipeTitle}
                            </h4>
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {recipe.recipeDescription}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-auto">
                          {recipe.recipeIndication && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-[10px] flex items-center gap-1 px-2 py-0.5"
                            >
                              <Clock className="h-3 w-3" />
                              {recipe.recipeIndication}
                            </Badge>
                          )}
                          {recipe.recipeCost && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] flex items-center gap-1 px-2 py-0.5"
                            >
                              <DollarSign className="h-3 w-3" />
                              {recipe.recipeCost}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </div>
                    {/* Remove Button (右上) */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8"
                      onClick={(e) => handleRemoveFavorite(e, recipe)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">削除</span>
                    </Button>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>

        <Separator className="my-8 bg-slate-200" />

        {/* --- History Section --- */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <History className="h-5 w-5 text-green-600" />
            作った履歴
            <span className="text-sm font-normal text-slate-500 ml-2">
              ({histories.length})
            </span>
          </h3>

          <div className="space-y-4">
            {histories.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">
                  履歴はまだありません
                </p>
              </div>
            ) : (
              // 履歴は新しい順に表示する想定（Firestore側でソートしていない場合はここで reverse() などが必要ですが、今回はそのまま）
              histories.map((item, index) => (
                <Link
                  // keyはユニークにするため index も使用（同じレシピが複数回ある可能性があるため）
                  key={`${item.recipeId}-${index}`}
                  href={`/recipes/${item.recipeId}`}
                  className="block"
                >
                  <Card className="border-none shadow-sm hover:shadow-md transition-all bg-white overflow-hidden">
                    <div className="flex items-center p-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md">
                        <img
                          src={item.foodImageUrl || item.mediumImageUrl}
                          alt={item.recipeTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-bold text-sm text-slate-800 line-clamp-1 mb-1">
                          {item.recipeTitle}
                        </h4>
                        <div className="flex items-center text-xs text-slate-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {item.cookedDate}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </section>

        <Separator className="my-8 bg-slate-200" />

        {/* --- Account Actions Section --- */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-slate-500 mb-2 px-1">
            アカウント設定
          </h3>
          <Button
            variant="outline"
            className="w-full justify-start h-12 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            <Settings className="h-5 w-5 mr-3 text-slate-400" />
            設定
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start h-12 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
          >
            <LogOut className="h-5 w-5 mr-3" />
            ログアウト
          </Button>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-2xl text-white mb-8">
            <ChefHat className="h-8 w-8" />
            <span>FoodMatch</span>
          </div>
          <div className="flex justify-center gap-8 mb-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors">
              利用規約
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              プライバシーポリシー
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              お問い合わせ
            </Link>
          </div>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} FoodMatch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}