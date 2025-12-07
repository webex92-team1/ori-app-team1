"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // ※環境に合わせてパスを確認してください
import {
  getFavoriteRecipes,
  getCookingHistory,
  removeFavoriteRecipe,
} from "@/lib/firestore";

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

  // データ取得と正規化処理
  const fetchData = async (uid) => {
    try {
      const [favData, histData] = await Promise.all([
        getFavoriteRecipes(uid),
        getCookingHistory(uid),
      ]);

      // 1. Firestoreスキーマに合わせる（正規化）
      // Firestoreの 'id' を UIで使う 'recipeId' としてマッピングし、
      // Firestoreの 'date' を UIで使う 'cookedDate' としてマッピングします。
      const normalizedFavorites = favData.map((item) => ({
        ...item,
        recipeId: item.id, // FirestoreのドキュメントIDを recipeId として確保
      }));

      const normalizedHistory = histData.map((item) => ({
        ...item,
        recipeId: item.id,
        cookedDate: item.date, // Firestoreの date を cookedDate として確保
      }));

      setFavorites(normalizedFavorites);
      setHistory(normalizedHistory);
    } catch (error) {
      console.error("データの取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. お気に入り削除の引数を修正 & 3. UI即時更新
  const handleDeleteFavorite = async (recipeId) => {
    if (!user) return;

    // UIを即時更新（楽観的UI更新）
    // 削除対象のID以外を残すフィルタリング
    const previousFavorites = [...favorites];
    setFavorites((prev) => prev.filter((fav) => fav.recipeId !== recipeId));

    try {
      // Firestoreから削除
      // removeFavoriteRecipe には { uid, recipeId } を渡す必要があると想定
      await removeFavoriteRecipe(user.uid, recipeId);
    } catch (error) {
      console.error("削除に失敗しました:", error);
      // エラー時は元の状態に戻す
      setFavorites(previousFavorites);
      alert("削除に失敗しました。");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">読み込み中...</div>;
  }

  if (!user) {
    return null; // リダイレクトまでのチラつき防止
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">お気に入りレシピ</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500">お気に入りはまだありません。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <div key={fav.recipeId} className="border rounded p-4 shadow bg-white relative">
                <h3 className="font-bold text-lg mb-2">{fav.title}</h3>
                {/* リンクや画像などがあればここに配置 */}
                
                <button
                  onClick={() => handleDeleteFavorite(fav.recipeId)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">調理履歴</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">履歴はまだありません。</p>
        ) : (
          <ul className="space-y-2">
            {history.map((item, index) => (
              <li key={index} className="border-b pb-2">
                <span className="font-medium">{item.title}</span>
                {/* date (正規化後は cookedDate) を表示 */}
                <span className="text-sm text-gray-500 ml-4">
                   {item.cookedDate ? new Date(item.cookedDate.seconds * 1000).toLocaleDateString() : "日付不明"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <button
          onClick={() => auth.signOut()}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}