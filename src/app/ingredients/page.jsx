"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChefHat,
  Plus,
  X,
  Search,
  Home,
  User,
  Refrigerator,
} from "lucide-react";

export default function IngredientsPage() {
  // 食材タグの状態管理
  const [ingredients, setIngredients] = useState(["卵", "玉ねぎ", "牛乳"]);
  const [inputValue, setInputValue] = useState("");

  // よく使われる食材のショートカット
  const commonIngredients = [
    "卵",
    "玉ねぎ",
    "牛乳",
    "にんじん",
    "じゃがいも",
    "鶏肉",
    "トマト",
    "チーズ",
    "キャベツ",
    "豚肉",
  ];

  // 食材を追加する関数
  const handleAddIngredient = () => {
    const value = inputValue.trim();
    if (value) {
      // 全角・半角スペースで分割し、空文字を除外
      const newIngredients = value.split(/[\s　]+/).filter(Boolean);
      // 重複を除外して追加
      setIngredients((prev) => {
        const uniqueNew = newIngredients.filter((item) => !prev.includes(item));
        return [...prev, ...uniqueNew];
      });
      setInputValue("");
    }
  };

  // 食材を削除する関数
  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // ショートカットから食材を追加する関数
  const handleAddFromShortcut = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
    }
  };

  // Enterキーでの追加ハンドリング（日本語変換確定時は発火させない）
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleAddIngredient();
    }
  };

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

      {/* --- Main Content --- */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* --- Page Header --- */}
        <section className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Refrigerator className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                食材を入力
              </h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                冷蔵庫にある食材を入力して、レシピを探しましょう
              </p>
            </div>
          </div>
        </section>

        {/* --- Ingredients Input Form --- */}
        <Card className="mb-6 border-none shadow-md bg-white overflow-hidden">
          <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-orange-500" />
              食材を追加
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  id="ingredient-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="例：卵 玉ねぎ 牛乳"
                  className="flex-1 h-12 text-base border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                />
                <Button
                  onClick={handleAddIngredient}
                  className="bg-orange-500 hover:bg-orange-600 text-white h-12 px-6 rounded-md font-bold shadow-md hover:shadow-lg transition-all shrink-0"
                >
                  追加
                </Button>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="text-slate-400">💡</span>
                スペース区切りで複数入力できます
              </p>
            </div>

            {/* --- Common Ingredients Shortcuts --- */}
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                よく使われる食材
              </h2>
              <div className="flex flex-wrap gap-2">
                {commonIngredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant="outline"
                    className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-all ${
                      ingredients.includes(ingredient)
                        ? "bg-orange-50 border-orange-200 text-orange-600 opacity-50 cursor-default"
                        : "border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => handleAddFromShortcut(ingredient)}
                  >
                    {ingredients.includes(ingredient) && (
                      <span className="mr-1">✓</span>
                    )}
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Ingredients Tags List --- */}
        <Card className="mb-10 border-none shadow-md bg-white">
          <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-900">
                現在のリスト
              </CardTitle>
              <CardDescription className="text-slate-500">
                {ingredients.length > 0
                  ? `${ingredients.length}個の食材`
                  : "食材はまだありません"}
              </CardDescription>
            </div>
            {ingredients.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIngredients([])}
                className="text-slate-400 hover:text-red-500 text-xs h-8"
              >
                すべて削除
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6 min-h-[120px]">
            {ingredients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <Refrigerator className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">食材が入力されていません</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <Badge
                    key={`${ingredient}-${index}`}
                    variant="secondary"
                    className="bg-orange-50 text-orange-700 border border-orange-100 pl-3 pr-1 py-1.5 text-base font-medium flex items-center gap-1 group hover:bg-orange-100 transition-colors"
                  >
                    <span>{ingredient}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="ml-1 hover:bg-orange-200 text-orange-400 hover:text-orange-700 rounded-full p-0.5 transition-colors"
                      aria-label={`${ingredient}を削除`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Search Recipes Button --- */}
        <div className="sticky bottom-6 z-40 flex justify-center pb-4 md:pb-0 md:static">
          <Button
            asChild
            size="lg"
            className={`w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all font-bold transform hover:-translate-y-1 ${
              ingredients.length === 0 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Link href="/recipes">
              <Search className="h-5 w-5 mr-2" />
              レシピを探す
            </Link>
          </Button>
        </div>
      </main>

      {/* --- Footer --- */}
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
