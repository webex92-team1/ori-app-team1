import { mockRecipes } from "./mockdata.js";

const BASE_URL = "https://app.rakuten.co.jp/services/api/Recipe";
const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;

// --- API通信関連 ---

const logApiError = async (res, url) => {
  try {
    const errorBody = await res.text();
    console.error(`\n[API Error Debug]`);
    console.error(`URL: ${url}`);
    console.error(`Status: ${res.status} ${res.statusText}`);
    console.error(`Body: ${errorBody}\n`);
  } catch (e) {
    console.error("Error body read failed");
  }
};

/**
 * カテゴリーIDを指定してレシピを検索する
 * @param {string} categoryId - 楽天レシピAPIのカテゴリーID
 * @param {AbortSignal} signal - AbortController用のシグナル
 * @returns {Promise<Array>} レシピ配列
 */
export const searchRecipesByCategory = async (categoryId, signal) => {
  // APP_IDが読み込めているかチェック
  if (!APP_ID) {
    alert(
      "❌ 環境変数が読み込めていません！\n\n・ファイル名が .env.local になっていますか？\n・srcフォルダの外（一番上の階層）にありますか？\n・サーバーを再起動しましたか？"
    );
    console.error("Error: NEXT_PUBLIC_RAKUTEN_APP_ID is not set.");
    return mockRecipes;
  }

  if (!categoryId) {
    console.warn("No categoryId provided, returning empty array");
    return [];
  }

  try {
    const url = new URL(`${BASE_URL}/CategoryRanking/20170426`);
    url.searchParams.append("format", "json");
    url.searchParams.append("categoryId", categoryId);
    url.searchParams.append("applicationId", APP_ID);

    console.log(`[API] Fetching recipes for categoryId: ${categoryId}`);
    const response = await fetch(url.toString(), { signal });

    // APIから拒否されていないかチェック
    if (!response.ok) {
      const errorText = response.statusText;
      await logApiError(response, url.toString());
      alert(
        `⚠️ APIエラーが発生しました！\n\nステータス: ${response.status}\n原因: ${errorText}\n\n※IDが間違っているか、利用制限の可能性があります。`
      );
      throw new Error(`Rakuten API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // データの中身チェック
    if (data.error) {
      alert(
        `⚠️ 楽天APIからエラーが返ってきました\n\n${
          data.error_description || JSON.stringify(data)
        }`
      );
      return mockRecipes;
    }

    if (!data.result) return [];

    console.log(`[API] Successfully fetched ${data.result.length} recipes`);

    return data.result.map((item) => ({
      recipeId: item.recipeId.toString(),
      recipeTitle: item.recipeTitle,
      foodImageUrl: item.foodImageUrl,
      recipeDescription: item.recipeDescription,
      recipeUrl: item.recipeUrl,
      recipeMaterial: Array.isArray(item.recipeMaterial)
        ? item.recipeMaterial
        : item.recipeMaterial
        ? [item.recipeMaterial]
        : [],
      recipeIndication: item.recipeIndication || "",
      recipeCost: item.recipeCost || "",
      rank: item.rank || 0,
      pickup: item.pickup || 0,
      nickname: item.nickname || "",
    }));
  } catch (error) {
    if (error.name === "AbortError") throw error;

    // その他の通信エラー
    alert(
      `❌ 通信エラーでプログラムが止まりました\n\nエラー内容: ${error.message}\n\n※Wi-Fiが切れていないか、CORSエラーが出ていないか確認してください。`
    );

    console.error("Failed to fetch recipes, falling back to mock data.", error);
    return mockRecipes;
  }
};

/**
 * レシピ詳細を取得
 * sessionStorageにキャッシュされたレシピデータを取得する
 * 楽天レシピAPIには個別レシピ取得エンドポイントがないため、
 * 一覧ページでクリック時にsessionStorageに保存しておく方式
 * @param {string} recipeId - レシピID
 * @returns {Object|null} レシピデータ
 */
export const getRecipeDetail = async (recipeId) => {
  if (typeof window === "undefined") return null;

  try {
    // sessionStorageから取得を試みる
    const cached = sessionStorage.getItem(`recipe_${recipeId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // キャッシュがない場合はモックから探す（フォールバック）
    const found = mockRecipes.find((r) => r.id === recipeId || r.recipeId === recipeId);
    return found || null;
  } catch (error) {
    console.error("Failed to get recipe detail:", error);
    return null;
  }
};

/**
 * レシピをsessionStorageにキャッシュする
 * 一覧ページでカードクリック前に呼び出す
 * @param {Object} recipe - レシピデータ
 */
export const cacheRecipeForDetail = (recipe) => {
  if (typeof window === "undefined" || !recipe) return;

  try {
    const id = recipe.recipeId || recipe.id;
    sessionStorage.setItem(`recipe_${id}`, JSON.stringify(recipe));
  } catch (error) {
    console.error("Failed to cache recipe:", error);
  }
};

// 後方互換性のため、古い関数名もエクスポート（非推奨）
export const searchRecipesByIngredients = searchRecipesByCategory;
