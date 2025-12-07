// src/app/recipes/page.jsx

"use client";

import Link from "next/link";
// 💡 useSearchParams, useEffect, useMemo をインポート
import { useState, useEffect, useMemo } from "react"; 
import { useSearchParams } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// 💡 AlertTriangle, Loader2 をインポート
import { 
  ChefHat, 
  Clock, 
  DollarSign, 
  User, 
  Home, 
  Search,
  AlertTriangle, 
  Loader2 
} from "lucide-react";

import { mockCategories } from "@/lib/mockdata";
// 💡 searchRecipesByIngredients (API関数) をインポート
import { searchRecipesByIngredients } from "@/lib/recipes"; 

// --- ローディングスケルトンコンポーネント (要件3) ---
const LoadingCard = () => (
  <Card className="h-full overflow-hidden border-none shadow-md bg-white animate-pulse">
    <div className="relative h-48 w-full bg-gray-200"></div>
    <CardContent className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
    </CardContent>
  </Card>
);

export default function RecipesPage() {
  // 1. useSearchParamsでingredientsクエリを読む
  const searchParams = useSearchParams();
  const ingredientsQuery = searchParams.get('ingredients');
  
  // 状態管理
  const [recipes, setRecipes] = useState(null); // nullは未取得状態
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("all");

  // --- 3. useEffect + AbortControllerでAPIを呼び出す ---
  useEffect(() => {
    // 2. クエリが存在しない場合は空状態を表示
    if (!ingredientsQuery) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes(null);

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchRecipes = async () => {
      try {
        const data = await searchRecipesByIngredients(ingredientsQuery, signal);
        
        // カテゴリフィルタリング用にデータを整形し、APIデータにcategoryIdを付与 (要件5対応)
        const mappedRecipes = data.map(recipe => {
          const categoryMatch = mockCategories.large.find(cat => 
            recipe.categoryUrl && recipe.categoryUrl.includes(cat.categoryId)
          );
          return {
            ...recipe,
            categoryId: categoryMatch ? categoryMatch.categoryId : 'unknown', 
          };
        });

        setRecipes(mappedRecipes);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        console.error("Failed to fetch recipes:", err);
        // 4. ネットワークエラー時はエラーカードを表示
        setError("レシピの取得中にエラーが発生しました。ネットワークを確認してください。");
        setLoading(false);
        setRecipes([]); // フォールバックで画面が崩れないように空配列
      }
    };

    fetchRecipes();

    // useEffectのクリーンアップ：通信をキャンセル
    return () => controller.abort();
  }, [ingredientsQuery]);

  // --- 5. カテゴリフィルターが API レスポンスに対して機能するようにする ---
  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    
    if (selectedCategory === "all") {
      return recipes;
    } else {
      // APIから付与された categoryId でフィルタリング
      return recipes.filter((recipe) =>
        recipe.categoryId.startsWith(selectedCategory)
      );
    }
  }, [recipes, selectedCategory]);


  // レシピ一覧のメインコンテンツをレンダリングする関数
  const renderContent = () => {
    // 2. クエリが存在しない場合の空状態
    if (!ingredientsQuery) {
        return (
            <div className="text-center py-20 bg-white shadow-sm rounded-lg mx-4">
                <Search className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-slate-700 mb-2">食材を入力してください</h2>
                <p className="text-slate-500 mb-6">
                  FoodMatchでは、持っている食材から手軽にレシピを探せます。
                </p>
                <Link href="/ingredients" passHref>
                    <Button className="bg-orange-500 hover:bg-orange-600">食材入力ページへ</Button>
                </Link>
            </div>
        );
    }

    // 3. 取得完了までローディングカードを表示
    if (loading || recipes === null) {
      return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          {[...Array(6)].map((_, i) => <LoadingCard key={i} />)}
        </div>
      );
    }

    // 4. ネットワークエラー時のエラーカード表示
    if (error) {
        return (
            <div className="text-center py-20 bg-red-50 border border-red-200 text-red-700 shadow-sm rounded-lg mx-4">
                <AlertTriangle className="h-10 w-10 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">エラーが発生しました</h2>
                <p className="mb-6">{error}</p>
                <p className="text-sm text-red-600">
                  時間を置いて再度お試しいただくか、ネットワーク接続を確認してください。
                </p>
            </div>
        );
    }

    // 検索結果0件 or フィルタリング結果0件
    if (recipes.length === 0 || filteredRecipes.length === 0) {
      const message = 
        recipes.length === 0
          ? `'${ingredientsQuery}'を含むレシピが見つかりませんでした。`
          : '選択したカテゴリではレシピが見つかりませんでした。';
          
      return (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">
            {message}
          </p>
        </div>
      );
    }

    // 6. カードクリックで /recipes/[id] に遷移
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Link
            key={recipe.recipeId}
            href={`/recipes/${recipe.recipeId}`} 
          >
            <Card className="h-full overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
              {/* レシピカードUI (中略 - 変更なし) */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={recipe.foodImageUrl} 
                  alt={recipe.recipeTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {recipe.pickup === 1 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-md">
                    人気
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recipe.recipeIndication} 
                </div>
              </div>

              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-lg text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors min-h-[56px]">
                  {recipe.recipeTitle}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                  {recipe.recipeDescription}
                </p>

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

                <div className="flex items-center gap-2 pt-2 text-xs text-slate-500">
                  <User className="h-3 w-3" />
                  <span>{recipe.nickname}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };


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
          <nav className="flex items-center gap-2">
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
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                <Search className="h-8 w-8 text-orange-500" />
                レシピ一覧
              </h1>
              <p className="text-slate-500">
                {ingredientsQuery ? `'${ingredientsQuery}' で検索中` : '食材を入力してください'}
                {recipes && recipes.length > 0 && <span> | {filteredRecipes.length}件のレシピが見つかりました</span>}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border-b py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                カテゴリで絞り込み
              </h2>
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
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

                  {/* カテゴリボタンのレンダリング (選択中の強調スタイル付き) */}
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

        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
                {renderContent()} 
            </div>
          </div>
        </section>
      </main>

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