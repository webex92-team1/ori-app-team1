"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChefHat,
  Clock,
  DollarSign,
  User,
  Home,
  ArrowLeft,
  Calendar,
  UtensilsCrossed,
  ListOrdered,
} from "lucide-react";
import { mockRecipes } from "@/lib/mockdata";

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id;

  // モックデータからレシピを取得
  const recipe = mockRecipes.find((r) => r.recipeId.toString() === recipeId);

  // レシピが見つからない場合
  if (!recipe) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ChefHat className="h-6 w-6" />
              <span>FoodMatch</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              レシピが見つかりませんでした
            </h1>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full"
            >
              <Link href="/recipes">レシピ一覧へ戻る</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
              className="text-slate-600 hover:text-orange-500"
            >
              <Link href="/mypage">
                <User className="h-4 w-4 mr-2" />
                マイページ
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Back Button Section --- */}
        <section className="bg-white py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Button
                variant="ghost"
                asChild
                className="text-slate-600 hover:text-orange-500 hover:bg-orange-50"
              >
                <Link href="/recipes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  レシピ一覧へ戻る
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- Recipe Detail Content --- */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <Card className="border-none shadow-lg bg-white overflow-hidden">
                {/* レスポンシブレイアウト: モバイル=縦1カラム、PC=横2カラム */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
                  {/* --- 左側: 画像エリア --- */}
                  <div className="space-y-4">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-md">
                      <img
                        src={recipe.foodImageUrl}
                        alt={recipe.recipeTitle}
                        className="w-full h-full object-cover"
                      />
                      {/* Pickup Badge */}
                      {recipe.pickup === 1 && (
                        <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-md">
                          人気レシピ
                        </div>
                      )}
                    </div>

                    {/* メタ情報 (モバイル用) */}
                    <div className="flex flex-wrap gap-2 md:hidden">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-sm flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <Clock className="h-4 w-4" />
                        {recipe.recipeIndication}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100 text-sm flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <DollarSign className="h-4 w-4" />
                        {recipe.recipeCost}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-slate-600 text-sm px-3 py-1.5"
                      >
                        ランク {recipe.rank}
                      </Badge>
                    </div>
                  </div>

                  {/* --- 右側: 詳細情報 --- */}
                  <div className="flex flex-col">
                    {/* タイトル */}
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                      {recipe.recipeTitle}
                    </h1>

                    {/* メタ情報 (PC用) */}
                    <div className="hidden md:flex flex-wrap gap-2 mb-4">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-sm flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <Clock className="h-4 w-4" />
                        {recipe.recipeIndication}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100 text-sm flex items-center gap-1.5 px-3 py-1.5"
                      >
                        <DollarSign className="h-4 w-4" />
                        {recipe.recipeCost}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-slate-600 text-sm px-3 py-1.5"
                      >
                        ランク {recipe.rank}
                      </Badge>
                    </div>

                    {/* 説明文 */}
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {recipe.recipeDescription}
                    </p>

                    <Separator className="my-4" />

                    {/* 作者・公開日 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{recipe.nickname}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(recipe.recipePublishday).toLocaleDateString(
                            "ja-JP"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* アクションボタン（今後の拡張用） */}
                    <div className="flex gap-3 mt-auto pt-4">
                      <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md">
                        お気に入り登録
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100 rounded-full"
                      >
                        作った！
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* --- 材料セクション --- */}
              <Card className="border-none shadow-lg bg-white mt-6">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <UtensilsCrossed className="h-5 w-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-slate-900">
                      材料一覧
                    </h2>
                  </div>
                  <Separator className="mb-4" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {recipe.recipeMaterial.map((material, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <div className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                        <span className="text-slate-700">{material}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* --- 作り方セクション --- */}
              <Card className="border-none shadow-lg bg-white mt-6">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <ListOrdered className="h-5 w-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-slate-900">作り方</h2>
                  </div>
                  <Separator className="mb-6" />
                  <div className="space-y-4">
                    {recipe.recipeInstructions.map((instruction, idx) => (
                      <div
                        key={idx}
                        className="flex gap-4 p-4 bg-slate-50 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold text-sm shrink-0">
                          {idx + 1}
                        </div>
                        <p className="text-slate-700 leading-relaxed flex-1 pt-1">
                          {instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* --- 戻るボタン (下部) --- */}
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  asChild
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 rounded-full px-8"
                >
                  <Link href="/recipes">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    レシピ一覧へ戻る
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-10">
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

