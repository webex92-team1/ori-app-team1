"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { mockUser, getFavoriteRecipesDetails } from "@/lib/mockdata";

export default function MyPage() {
  // お気に入りレシピの詳細データを取得
  const favoriteRecipes = getFavoriteRecipesDetails(mockUser.favorites);

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
              asChild
              className="text-orange-500 bg-orange-50 hover:bg-orange-100 hover:text-orange-600"
            >
              <Link href="/mypage">
                <User className="h-4 w-4 mr-2" />
                マイページ
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-xl">
        {/* --- Profile Section --- */}
        <Card className="mb-8 border-none shadow-md bg-white">
          <CardContent className="flex flex-col items-center p-8">
            <Avatar className="h-24 w-24 mb-4 border-4 border-orange-50">
              <AvatarImage src="" alt={mockUser.name} />
              <AvatarFallback className="bg-orange-100 text-orange-500 text-2xl font-bold">
                {mockUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {mockUser.name}
            </h2>
            <p className="text-sm text-slate-500 mb-6">{mockUser.email}</p>
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
              ({favoriteRecipes.length})
            </span>
          </h3>

          <div className="space-y-4">
            {favoriteRecipes.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500">
                  お気に入りのレシピはまだありません
                </p>
                <Button variant="link" asChild className="text-orange-500 mt-2">
                  <Link href="/recipes">レシピを探す</Link>
                </Button>
              </div>
            ) : (
              favoriteRecipes.map((recipe) => (
                <Link
                  key={recipe.recipeId}
                  href={`/recipes/${recipe.recipeId}`}
                  className="block"
                >
                  <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 group bg-white">
                    <div className="flex flex-col sm:flex-row p-3">
                      {/* Image (Mobile: Top, Desktop: Left) */}
                      <div className="relative w-full sm:w-40 h-40 sm:h-auto shrink-0 overflow-hidden">
                        <img
                          src={recipe.foodImageUrl}
                          alt={recipe.recipeTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Pickup Badge (Mobile only) */}
                        {recipe.pickup === 1 && (
                          <div className="absolute top-2 left-2 sm:hidden bg-orange-500 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-md">
                            人気
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="flex-1 p-2 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors">
                              {recipe.recipeTitle}
                            </h4>
                            {/* Pickup Badge (Desktop only) */}
                            {recipe.pickup === 1 && (
                              <Badge className="hidden sm:inline-flex bg-orange-500 hover:bg-orange-600 text-[10px] shrink-0">
                                人気
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                            {recipe.recipeDescription}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mt-auto">
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-[10px] flex items-center gap-1 px-2 py-0.5"
                          >
                            <Clock className="h-3 w-3" />
                            {recipe.recipeIndication}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 hover:bg-green-100 text-[10px] flex items-center gap-1 px-2 py-0.5"
                          >
                            <DollarSign className="h-3 w-3" />
                            {recipe.recipeCost}
                          </Badge>
                        </div>
                      </CardContent>
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
