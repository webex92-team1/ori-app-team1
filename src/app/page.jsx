import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Search,
  ChefHat,
  Refrigerator,
  ArrowRight,
  Utensils,
  Clock,
  Flame,
} from "lucide-react";
import { mockRecipes } from "@/lib/mockdata";

export default function Home() {
  // 人気レシピをピックアップ（モックデータから上位5件）
  const popularRecipes = mockRecipes.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-orange-500">
            <ChefHat className="h-6 w-6" />
            <span>FoodMatch</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-slate-600 hover:text-orange-500"
            >
              <Link href="/login">ログイン</Link>
            </Button>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-6"
            >
              <Link href="/signup">新規登録</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-orange-50 to-yellow-50 -z-10" />
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <Badge
              variant="outline"
              className="mb-4 border-orange-200 text-orange-600 bg-orange-50 px-4 py-1"
            >
              毎日の献立にもう迷わない
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              冷蔵庫の<span className="text-orange-500">余り物</span>で、
              <br />
              今日のごはんが決まる。
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              家にある食材を入力するだけで、最適なレシピをAIが提案。
              <br className="hidden md:block" />
              食材ロスを減らして、毎日の料理をもっと楽しく。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/signup">
                  無料で始める <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-100 text-lg px-8 py-6 rounded-full"
              >
                <Link href="/login">ログインする</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                FoodMatchでできること
              </h2>
              <p className="text-slate-500">
                3つのステップで、あなたの料理ライフをサポートします
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <Card className="border-none shadow-md bg-slate-50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6 text-orange-500">
                    <Refrigerator className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">
                    食材を入力
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    冷蔵庫にある食材をテキストで入力するだけ。賞味期限が近い食材も優先的に活用できます。
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-none shadow-md bg-slate-50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">
                    レシピを提案
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    楽天レシピの膨大なデータから、今すぐ作れる最適なレシピを瞬時に見つけ出します。
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-none shadow-md bg-slate-50 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <Utensils className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">
                    履歴・お気に入り
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    作った料理は履歴に保存。「あの時作ったあれ」をすぐに呼び出せます。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Popular Recipes Preview --- */}
        <section className="py-20 bg-slate-50 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  人気のレシピ
                </h2>
                <p className="text-slate-500">みんなが作っている定番メニュー</p>
              </div>
              <Button variant="link" className="text-orange-500 hidden md:flex">
                もっと見る <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex w-max space-x-4 p-1">
                {popularRecipes.map((recipe) => (
                  <Card
                    key={recipe.recipeId}
                    className="w-[280px] md:w-[320px] shrink-0 overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white"
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={recipe.foodImageUrl}
                        alt={recipe.recipeTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {recipe.recipeIndication}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-[10px]"
                        >
                          {recipe.recipeCost}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 mb-2 truncate group-hover:text-orange-500 transition-colors">
                        {recipe.recipeTitle}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 whitespace-normal h-10">
                        {recipe.recipeDescription}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <div className="mt-6 text-center md:hidden">
              <Button variant="link" className="text-orange-500">
                もっと見る <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* --- Bottom CTA --- */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-orange-500 rounded-3xl p-10 md:p-16 text-white shadow-xl max-w-4xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] opacity-10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  今日の献立作りを始めましょう
                </h2>
                <p className="text-orange-100 mb-10 text-lg max-w-2xl mx-auto">
                  登録は無料。メールアドレスまたはGoogleアカウントですぐに始められます。
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-slate-100 text-lg px-10 py-6 rounded-full shadow-lg"
                >
                  <Link href="/signup">無料でアカウント作成</Link>
                </Button>
              </div>
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
