"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
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
import {
  ChefHat,
  Search,
  Home,
  User,
  Loader2,
  Check,
  X,
  ChevronRight,
} from "lucide-react";
import {
  loadCategories,
  searchCategories,
  popularCategories,
} from "@/lib/categories";

export default function IngredientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 状態管理
  const [categories, setCategories] = useState([]); // 全カテゴリー
  const [inputValue, setInputValue] = useState(""); // 検索入力
  const [filteredCategories, setFilteredCategories] = useState([]); // 検索候補
  const [selectedCategory, setSelectedCategory] = useState(null); // 選択されたカテゴリー
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ドロップダウン表示
  const [isInitializing, setIsInitializing] = useState(true); // 初期化中フラグ
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // キーボード選択用

  // 認証チェックとカテゴリー読み込み
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    // カテゴリーを読み込む
    const initCategories = async () => {
      const cats = await loadCategories();
      setCategories(cats);
      setIsInitializing(false);
    };

    initCategories();
  }, [user, loading, router]);

  // 検索入力の変更を処理
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.trim()) {
        const results = searchCategories(value, categories, 15);
        setFilteredCategories(results);
        setIsDropdownOpen(results.length > 0);
        setHighlightedIndex(-1);
      } else {
        setFilteredCategories([]);
        setIsDropdownOpen(false);
      }
    },
    [categories]
  );

  // カテゴリーを選択
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setInputValue("");
    setFilteredCategories([]);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  // 選択を解除
  const handleClearSelection = () => {
    setSelectedCategory(null);
  };

  // 人気カテゴリーから選択
  const handleSelectPopular = (category) => {
    // カテゴリー配列から完全な情報を取得
    const fullCategory = categories.find((c) => c.id === category.id);
    if (fullCategory) {
      setSelectedCategory(fullCategory);
    } else {
      // 見つからない場合は人気カテゴリーの情報をそのまま使用
      setSelectedCategory(category);
    }
  };

  // キーボード操作
  const handleKeyDown = (e) => {
    if (!isDropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCategories.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredCategories[highlightedIndex]) {
          handleSelectCategory(filteredCategories[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // 検索ボタンハンドラ
  const handleSearch = () => {
    if (!selectedCategory) {
      alert("カテゴリーを選択してください");
      return;
    }

    // カテゴリーIDをクエリパラメータとして渡す
    router.push(
      `/recipes?categoryId=${encodeURIComponent(selectedCategory.id)}&categoryName=${encodeURIComponent(selectedCategory.name)}`
    );
  };

  // クリック外でドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 認証確認中または初期化中はローディング表示
  if (loading || isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans text-slate-900">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
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

      {/* --- Main Content --- */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {/* --- Page Header --- */}
        <section className="mb-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <Search className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                カテゴリーを選択
              </h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                料理のカテゴリーを選んで、レシピを探しましょう
              </p>
            </div>
          </div>
        </section>

        {/* --- Category Search Form --- */}
        <Card className="mb-6 border-none shadow-md bg-white overflow-hidden">
          <CardHeader className="pb-4 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Search className="h-5 w-5 text-orange-500" />
              カテゴリーを検索
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* 検索入力 */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (filteredCategories.length > 0) {
                        setIsDropdownOpen(true);
                      }
                    }}
                    placeholder="例：カレー、ハンバーグ、パスタ..."
                    className="h-12 text-base border-slate-300 focus:border-orange-500 focus:ring-orange-500"
                  />

                  {/* 検索候補ドロップダウン */}
                  {isDropdownOpen && filteredCategories.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
                    >
                      {filteredCategories.map((category, index) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleSelectCategory(category)}
                          className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-orange-50 transition-colors ${
                            index === highlightedIndex
                              ? "bg-orange-50"
                              : ""
                          } ${
                            index !== filteredCategories.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }`}
                        >
                          <span className="text-slate-700">{category.name}</span>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span className="text-slate-400">💡</span>
                料理名やカテゴリー名を入力して検索
              </p>
            </div>

            {/* --- 人気カテゴリー --- */}
            <div>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                人気のカテゴリー
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedCategory?.id === category.id
                        ? "bg-orange-50 border-orange-200 text-orange-600"
                        : "border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                    onClick={() => handleSelectPopular(category)}
                  >
                    {selectedCategory?.id === category.id && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- Selected Category Display --- */}
        <Card className="mb-10 border-none shadow-md bg-white">
          <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold text-slate-900">
                選択中のカテゴリー
              </CardTitle>
              <CardDescription className="text-slate-500">
                {selectedCategory
                  ? "このカテゴリーでレシピを検索します"
                  : "カテゴリーを選択してください"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6 min-h-[100px]">
            {selectedCategory ? (
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2 text-lg font-medium flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  {selectedCategory.name}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-slate-400 hover:text-red-500 h-8"
                >
                  <X className="h-4 w-4 mr-1" />
                  クリア
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                <Search className="h-10 w-10 mb-2 opacity-20" />
                <p className="text-sm">カテゴリーが選択されていません</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* --- Search Recipes Button --- */}
        <div className="sticky bottom-6 z-40 flex justify-center pb-4 md:pb-0 md:static">
          <Button
            onClick={handleSearch}
            size="lg"
            disabled={!selectedCategory}
            className={`w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all font-bold transform hover:-translate-y-1 ${
              !selectedCategory ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Search className="h-5 w-5 mr-2" />
            レシピを探す
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
