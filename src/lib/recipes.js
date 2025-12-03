import { mockRecipes } from "./mockdata.js";

const BASE_URL = "https://app.rakuten.co.jp/services/api/Recipe";
const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;

// 読み込んだカテゴリデータをメモリに保存しておく変数（キャッシュ）
let cachedCategories = null;

/**
 * 文字列を正規化するヘルパー関数
 * ・カタカナをひらがなに変換
 * ・大文字を小文字に変換
 */
const normalizeString = (str) => {
  if (!str) return "";
  let normalized = str.trim();

  // カタカナをひらがなに変換
  normalized = normalized.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });

  // 英数字を小文字化
  return normalized.toLowerCase();
};

/**
 * TSVファイルを読み込んで解析する関数
 * 実行環境に合わせて、public/categories.tsv を適切な方法で取得します
 */
const loadCategoriesFromTSV = async () => {
  // すでに読み込み済みなら、それを返す（キャッシュ利用）
  if (cachedCategories) return cachedCategories;

  let text = "";

  try {
    if (typeof window !== "undefined") {
      console.log("[Debug] Fetching TSV from browser...");
      const res = await fetch("/categories.tsv");
      if (!res.ok) throw new Error(`TSV fetch failed: ${res.statusText}`);
      text = await res.text();
    } else {
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const filePath = path.resolve(process.cwd(), "public", "categories.tsv");

      console.log(`[Debug] Loading local file: ${filePath}`);
      text = await fs.readFile(filePath, "utf-8");
    }

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
 */
const getCategoryIdFromTSV = async (keyword) => {
  if (!keyword) return null;
  const lines = await loadCategoriesFromTSV();

  // 検索ワードを正規化（ひらがな化など）
  const normalizedKeyword = normalizeString(keyword);

  // 1行ずつチェックして、カテゴリ名にキーワードが含まれるか探す
  const foundLine = lines.find((line) => {
    const columns = line.split("\t"); // タブ区切り
    if (columns.length < 2) return false;

    const categoryName = columns[1]; // 2列目がカテゴリ名
    const normalizedCategoryName = normalizeString(categoryName);

    // 正規化した状態で部分一致判定
    return normalizedCategoryName.includes(normalizedKeyword);
  });

  if (!foundLine) return null;

  // IDを抽出 (1列目)
  const columns = foundLine.split("\t");
  const id = columns[0];

  console.log(
    `[Debug] Found in TSV: "${keyword}" -> ID: ${id} (Category: ${columns[1]})`
  );
  return id;
};

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

export const searchRecipesByIngredients = async (ingredients, signal) => {
  // 【診断1】APP_IDが読み込めているかチェック
  if (!APP_ID) {
    alert(
      "❌ 環境変数が読み込めていません！\n\n・ファイル名が .env.local になっていますか？\n・srcフォルダの外（一番上の階層）にありますか？\n・サーバーを再起動しましたか？"
    );
    console.error("Error: NEXT_PUBLIC_RAKUTEN_APP_ID is not set.");
    return mockRecipes;
  }

  if (!ingredients || ingredients.length === 0) return [];

  try {
    const mainIngredient = ingredients[0];

    // TSVの読み込み確認
    let categoryId = await getCategoryIdFromTSV(mainIngredient);

    if (!categoryId) {
      console.warn(`Category not found for: ${mainIngredient}. Using Default.`);
      categoryId = "30";
    }

    const url = new URL(`${BASE_URL}/CategoryRanking/20170426`);
    url.searchParams.append("format", "json");
    url.searchParams.append("categoryId", categoryId);
    url.searchParams.append("applicationId", APP_ID);

    const response = await fetch(url.toString(), { signal });

    // 【診断2】APIから拒否されていないかチェック
    if (!response.ok) {
      const errorText = await response.statusText;
      alert(
        `⚠️ APIエラーが発生しました！\n\nステータス: ${response.status}\n原因: ${errorText}\n\n※IDが間違っているか、利用制限の可能性があります。`
      );
      throw new Error(`Rakuten API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // 【診断3】データの中身チェック
    if (data.error) {
      alert(
        `⚠️ 楽天APIからエラーが返ってきました\n\n${
          data.error_description || JSON.stringify(data)
        }`
      );
      return mockRecipes;
    }

    if (!data.result) return [];

    // 成功したらアラートで通知
    alert(
      `✅ 通信成功！\n\n「${mainIngredient}」のレシピを ${data.result.length} 件取得しました！`
    );

    return data.result.map((item) => ({
      id: item.recipeId.toString(),
      title: item.recipeTitle,
      image: item.foodImageUrl,
      description: item.recipeDescription,
      url: item.recipeUrl,
      material: Array.isArray(item.recipeMaterial)
        ? item.recipeMaterial
        : item.recipeMaterial
        ? [item.recipeMaterial]
        : [],
      time: item.recipeIndication || "",
      cost: item.recipeCost || "",
    }));
  } catch (error) {
    if (error.name === "AbortError") throw error;

    // 【診断4】その他の通信エラー
    alert(
      `❌ 通信エラーでプログラムが止まりました\n\nエラー内容: ${error.message}\n\n※Wi-Fiが切れていないか、CORSエラーが出ていないか確認してください。`
    );

    console.error("Failed to fetch recipes, falling back to mock data.", error);
    return mockRecipes;
  }
};

export const getRecipeDetail = async (recipeId, signal) => {
  const found = mockRecipes.find((r) => r.id === recipeId);
  return found || mockRecipes[0];
};
