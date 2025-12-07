/**
 * カテゴリーデータ管理モジュール
 * TSVファイルからカテゴリーを読み込み、検索機能を提供
 */

// 読み込んだカテゴリデータをメモリに保存しておく変数（キャッシュ）
let cachedCategories = null;

/**
 * 文字列を正規化するヘルパー関数
 * ・カタカナをひらがなに変換
 * ・大文字を小文字に変換
 */
export const normalizeString = (str) => {
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
 * TSVファイルを読み込んでカテゴリー配列として返す
 * @returns {Promise<Array<{id: string, name: string, url: string}>>}
 */
export const loadCategories = async () => {
  // すでに読み込み済みなら、それを返す（キャッシュ利用）
  if (cachedCategories) return cachedCategories;

  let text = "";

  try {
    if (typeof window !== "undefined") {
      // ブラウザ環境
      console.log("[Categories] Fetching TSV from browser...");
      const res = await fetch("/categories.tsv");
      if (!res.ok) throw new Error(`TSV fetch failed: ${res.statusText}`);
      text = await res.text();
    } else {
      // Node.js環境（SSR時）
      const fs = await import("node:fs/promises");
      const path = await import("node:path");
      const filePath = path.resolve(process.cwd(), "public", "categories.tsv");

      console.log(`[Categories] Loading local file: ${filePath}`);
      text = await fs.readFile(filePath, "utf-8");
    }

    // 行ごとに分割してパース
    const lines = text.split("\n");
    const categories = [];

    // 1行目はヘッダーなのでスキップ
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split("\t");
      if (columns.length >= 3) {
        categories.push({
          id: columns[0],
          name: columns[1],
          url: columns[2],
        });
      }
    }

    cachedCategories = categories;
    console.log(`[Categories] Loaded ${categories.length} categories`);
    return categories;
  } catch (e) {
    console.error("Failed to load categories TSV:", e);
    return [];
  }
};

/**
 * カテゴリーを検索する
 * @param {string} query - 検索クエリ
 * @param {Array} categories - カテゴリー配列
 * @param {number} limit - 最大件数（デフォルト20）
 * @returns {Array} マッチしたカテゴリー
 */
export const searchCategories = (query, categories, limit = 20) => {
  if (!query || !categories || categories.length === 0) {
    return [];
  }

  const normalizedQuery = normalizeString(query);

  // 部分一致で検索
  const results = categories.filter((category) => {
    const normalizedName = normalizeString(category.name);
    return normalizedName.includes(normalizedQuery);
  });

  // 完全一致を先頭に、部分一致を後ろにソート
  results.sort((a, b) => {
    const aName = normalizeString(a.name);
    const bName = normalizeString(b.name);

    // 完全一致を優先
    if (aName === normalizedQuery && bName !== normalizedQuery) return -1;
    if (bName === normalizedQuery && aName !== normalizedQuery) return 1;

    // 前方一致を優先
    const aStartsWith = aName.startsWith(normalizedQuery);
    const bStartsWith = bName.startsWith(normalizedQuery);
    if (aStartsWith && !bStartsWith) return -1;
    if (bStartsWith && !aStartsWith) return 1;

    // 名前の長さが短い方を優先（より具体的なカテゴリー）
    return a.name.length - b.name.length;
  });

  return results.slice(0, limit);
};

/**
 * IDからカテゴリーを取得する
 * @param {string} categoryId - カテゴリーID
 * @param {Array} categories - カテゴリー配列
 * @returns {Object|null} カテゴリー
 */
export const getCategoryById = (categoryId, categories) => {
  if (!categoryId || !categories) return null;
  return categories.find((cat) => cat.id === categoryId) || null;
};

/**
 * 人気カテゴリーのリスト（ショートカット用）
 */
export const popularCategories = [
  { id: "30-300", name: "ハンバーグ" },
  { id: "30-307", name: "カレー" },
  { id: "30-309", name: "唐揚げ" },
  { id: "14-121", name: "オムライス" },
  { id: "15-687", name: "カルボナーラ" },
  { id: "30-301", name: "餃子" },
  { id: "33-353", name: "だし巻き卵・卵焼き" },
  { id: "17-159", name: "味噌汁" },
  { id: "14-131", name: "チャーハン" },
  { id: "30-302", name: "肉じゃが" },
];
