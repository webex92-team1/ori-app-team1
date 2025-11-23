import { mockRecipes } from "./mockdata.js";

// 楽天レシピAPIのエンドポイント
const BASE_URL =
  "https://app.rakuten.co.jp/services/api/Recipe/KeywordSearch/20170426";
const APP_ID = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;

/**
 * 食材リストからレシピを検索する
 * @param {string[]} ingredients - 食材の配列 ["卵", "玉ねぎ"]
 * @param {AbortSignal} [signal] - キャンセル用のシグナル
 */
export const searchRecipesByIngredients = async (ingredients, signal) => {
  // アプリIDがない場合はエラーにする（開発時の設定忘れ防止）
  if (!APP_ID) {
    console.error("Error: NEXT_PUBLIC_RAKUTEN_APP_ID is not set.");
    return mockRecipes;
  }

  // 食材が空の場合は空配列を返す
  if (!ingredients || ingredients.length === 0) {
    return [];
  }

  try {
    // 複数の食材をスペース区切りで連結（例: "卵 玉ねぎ"）
    const keyword = ingredients.join(" ");

    // URLの組み立て
    const url = new URL(BASE_URL);
    url.searchParams.append("format", "json");
    url.searchParams.append("keyword", keyword);
    url.searchParams.append("applicationId", APP_ID);

    const response = await fetch(url.toString(), { signal });

    if (!response.ok) {
      throw new Error(`Rakuten API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // APIの結果が存在しない場合
    if (!data.result) {
      return [];
    }

    // APIのデータをアプリで使いやすい形に正規化して返す
    return data.result.map((item) => ({
      id: item.recipeId.toString(),
      title: item.recipeTitle,
      image: item.foodImageUrl,
      description: item.recipeDescription,
      url: item.recipeUrl,
      material: item.recipeMaterial || [], // 材料リスト
      time: item.recipeIndication || "", // 目安時間
      cost: item.recipeCost || "", // 目安費用
    }));
  } catch (error) {
    // ユーザーによるキャンセルの場合はエラーログを出さない
    if (error.name === "AbortError") {
      throw error;
    }

    // ネットワークエラーやAPI制限のときは、アプリを止めずにモックデータを返す（要件通り）
    console.error("Failed to fetch recipes, falling back to mock data:", error);
    return mockRecipes;
  }
};

/**
 * レシピIDから詳細情報を取得する
 * ※ 楽天レシピAPIには「ID指定で詳細取得」する専用エンドポイントがないため、
 * キーワード検索などを駆使するか、簡易的に実装します。
 * ここでは要件に従い「詳細取得APIを叩く」動きを模倣しつつ、失敗時はモックを返します。
 * * @param {string} recipeId
 * @param {AbortSignal} [signal]
 */
export const getRecipeDetail = async (recipeId, signal) => {
  if (!APP_ID) return mockRecipes[0];

  try {
    // 楽天APIにはID検索がないため、ここでは擬似的にIDをキーワードとして検索を試みる
    // （※実際にはIDで検索ヒットしない場合が多いですが、APIクライアントの構造として実装します）
    const url = new URL(BASE_URL);
    url.searchParams.append("format", "json");
    url.searchParams.append("keyword", recipeId); // IDをキーワードにする
    url.searchParams.append("applicationId", APP_ID);

    const response = await fetch(url.toString(), { signal });

    if (!response.ok) throw new Error("API Error");

    const data = await response.json();
    const recipe = data.result && data.result[0];

    if (recipe) {
      return {
        id: recipe.recipeId.toString(),
        title: recipe.recipeTitle,
        image: recipe.foodImageUrl,
        description: recipe.recipeDescription,
        url: recipe.recipeUrl,
        // APIでは詳細な手順(steps)が取れない場合が多いので、材料だけマッピング
        material: recipe.recipeMaterial || [],
        instructions: [], // 楽天API(無料版)では手順テキストが取得できない仕様のため空配列
      };
    } else {
      throw new Error("Recipe not found in API");
    }
  } catch (error) {
    if (error.name === "AbortError") throw error;

    console.warn(
      `Fetch detail failed for ID: ${recipeId}. Using mock fallback.`
    );

    // フォールバック：モックデータからIDが一致するものを探す、なければ最初のものを返す
    const found = mockRecipes.find((r) => r.id === recipeId);
    return found || mockRecipes[0];
  }
};
