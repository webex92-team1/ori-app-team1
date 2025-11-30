"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChefHat, Clock, DollarSign, User, Home, Search } from "lucide-react";
import { mockRecipes, mockCategories } from "@/lib/mockdata";

export default function RecipesPage() {
  // カテゴリフィルターの状態管理
  const [selectedCategory, setSelectedCategory] = useState("all");

  // フィルタリングされたレシピ
  const filteredRecipes =
    selectedCategory === "all"
      ? mockRecipes
      : mockRecipes.filter((recipe) =>
          recipe.categoryId.startsWith(selectedCategory)
        );

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
        {/* --- Page Header --- */}
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Search className="h-8 w-8 text-orange-500" />
                レシピ一覧
              </h1>
              <p className="text-slate-500">
                {selectedCategory === "all"
                  ? `全${filteredRecipes.length}件のレシピ`
                  : `${filteredRecipes.length}件のレシピが見つかりました`}
              </p>
            </div>
          </div>
        </section>

        {/* --- Category Filter --- */}
        <section className="bg-white border-b py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                カテゴリで絞り込み
              </h2>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {/* 全て */}
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("all")}
                    className={
                      selectedCategory === "all"
                        ? "bg-orange-500 hover:bg-orange-600 text-white rounded-full shrink-0"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100 rounded-full shrink-0"
                    }
                  >
                    すべて
                  </Button>

                  {/* 大カテゴリ */}
                  {mockCategories.large.map((category) => (
                    <Button
                      key={category.categoryId}
                      variant={
                        selectedCategory === category.categoryId
                          ? "default"
                          : "outline"
                      }
                      onClick={() => setSelectedCategory(category.categoryId)}
                      className={
                        selectedCategory === category.categoryId
                          ? "bg-orange-500 hover:bg-orange-600 text-white rounded-full shrink-0"
                          : "border-slate-300 text-slate-700 hover:bg-slate-100 rounded-full shrink-0"
                      }
                    >
                      {category.categoryName}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        </section>

        {/* --- Recipe Grid --- */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-500 text-lg">
                    レシピが見つかりませんでした
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <Link
                      key={recipe.recipeId}
                      href={`/recipes/${recipe.recipeId}`}
                    >
                      <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
                        {/* Recipe Image */}
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={recipe.foodImageUrl}
                            alt={recipe.recipeTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Pickup Badge */}
                          {recipe.pickup === 1 && (
                            <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                              人気
                            </div>
                          )}
                          {/* Time Badge */}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {recipe.recipeIndication}
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-3">
                          {/* Title */}
                          <h3 className="font-bold text-lg text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors min-h-[56px]">
                            {recipe.recipeTitle}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                            {recipe.recipeDescription}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-2 pt-2">
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs flex items-center gap-1"
                            >
                              <DollarSign className="h-3 w-3" />
                              {recipe.recipeCost}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-slate-200 text-slate-600 text-xs"
                            >
                              ランク {recipe.rank}
                            </Badge>
                          </div>

                          {/* Ingredients Preview */}
                          <div className="pt-2 border-t border-slate-100">
                            <p className="text-xs text-slate-400 mb-2">
                              主な材料
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {recipe.recipeMaterial
                                .slice(0, 3)
                                .map((material, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="secondary"
                                    className="bg-slate-100 text-slate-700 hover:bg-slate-100 text-[10px] font-normal"
                                  >
                                    {material.split(" ")[0].replace(/☆/g, "")}
                                  </Badge>
                                ))}
                              {recipe.recipeMaterial.length > 3 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-500 hover:bg-slate-100 text-[10px] font-normal"
                                >
                                  +{recipe.recipeMaterial.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Author */}
                          <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                            <User className="h-3 w-3" />
                            <span>{recipe.nickname}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12">
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