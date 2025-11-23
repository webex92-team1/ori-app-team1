import { mockRecipes } from "./mockdata.js";

const BASE_URL = "https://app.rakuten.co.jp/services/api/Recipe";
const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
const TSV_FILE_PATH = "/categories.tsv"; // publicフォルダ内のファイルパス

// 読み込んだカテゴリデータをメモリに保存しておく変数（キャッシュ）
let cachedCategories = null;

/**
 * TSVファイルを読み込んで解析する関数
 */
const loadCategoriesFromTSV = async () => {
  // すでに読み込み済みなら、それを返す（何度も通信しない）
  if (cachedCategories) return cachedCategories;

  try {
    console.log("[Debug] Loading categories.tsv...");
    const res = await fetch(TSV_FILE_PATH);
    if (!res.ok) throw new Error("TSV load failed");

    const text = await res.text();
    // 行ごとに分割して配列にする
    cachedCategories = text.split("\n");
    return cachedCategories;
  } catch (e) {
    console.error("Failed to load TSV:", e);
    return [];
  }
};

/**
 * TSVデータからキーワードに一致するIDを探す関数
 * ロジック: 行の中に「食材名」が含まれていたら、その行にある「IDっぽい数字」を返す
 */
const getCategoryIdFromTSV = async (keyword) => {
  const lines = await loadCategoriesFromTSV();

  // 1行ずつチェックして、キーワードを含む行を探す
  // ※楽天のデータは新しい順や人気順ではないので、最初に見つかったものを採用します
  const foundLine = lines.find((line) => line.includes(keyword));

  if (!foundLine) return null;

  // 見つかった行から「IDっぽい文字列」を抽出する正規表現
  // 楽天のIDは "33-445" (中分類) や "30" (大分類) の形です
  const match = foundLine.match(/(\d+-\d+|\d+)/);

  if (match) {
    console.log(
      `[Debug] Found in TSV: ${keyword} -> ID: ${
        match[0]
      } (Line: ${foundLine.substring(0, 20)}...)`
    );
    return match[0];
  }

  return null;
};

// --- ここから下は以前と同じロジック ---

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

export const searchRecipesByIngredients = async (ingredients, signal) => {
  if (!APP_ID) {
    console.error("Error: NEXT_PUBLIC_RAKUTEN_APP_ID is not set.");
    return mockRecipes;
  }
  if (!ingredients || ingredients.length === 0) return [];

  try {
    const mainIngredient = ingredients[0];
    console.log(`[Debug] Searching for ingredient: ${mainIngredient}`);

    // ★ここが変わった！TSVからIDを探す
    let categoryId = await getCategoryIdFromTSV(mainIngredient);

    if (!categoryId) {
      console.warn(
        `[Debug] Category not found in TSV for: ${mainIngredient}. Using Default.`
      );
      categoryId = "30"; // 見つからないときは「人気メニュー」カテゴリなどへ
    }

    const url = new URL(`${BASE_URL}/CategoryRanking/20170426`);
    url.searchParams.append("format", "json");
    url.searchParams.append("categoryId", categoryId);
    url.searchParams.append("applicationId", APP_ID);

    console.log(`[Debug] Fetching Ranking URL...`);
    const response = await fetch(url.toString(), { signal });

    if (!response.ok) {
      await logApiError(response, url.toString());
      throw new Error(`Rakuten API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.result) return [];

    return data.result.map((item) => ({
      id: item.recipeId.toString(),
      title: item.recipeTitle,
      image: item.foodImageUrl,
      description: item.recipeDescription,
      url: item.recipeUrl,
      material: item.recipeMaterial || [],
      time: item.recipeIndication || "",
      cost: item.recipeCost || "",
    }));
  } catch (error) {
    if (error.name === "AbortError") throw error;
    console.error("Failed to fetch recipes, falling back to mock data.");
    return mockRecipes;
  }
};

export const getRecipeDetail = async (recipeId, signal) => {
  const found = mockRecipes.find((r) => r.id === recipeId);
  return found || mockRecipes[0];
};
