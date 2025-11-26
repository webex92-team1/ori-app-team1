import {
  createUserProfile,
  getUserProfile,
  upsertFavoriteRecipe,
  removeFavoriteRecipe,
  addHistoryEntry,
} from "../src/lib/firestore.js";

const uid = process.env.TEST_UID || "dev-test";
const email = process.env.TEST_EMAIL || "dev@example.com";
const name = process.env.TEST_NAME || "Dev User";

const sampleRecipe = {
  id: "sample-recipe",
  title: "テストレシピ",
  description: "Firestore helper テスト用",
};

async function main() {
  console.log("=== Firestore helper テスト開始 ===");
  await createUserProfile({ uid, email, name });
  console.log("createUserProfile: OK");

  const profile = await getUserProfile(uid);
  console.log("getUserProfile:", profile);

  await upsertFavoriteRecipe({ uid, recipe: sampleRecipe });
  console.log("upsertFavoriteRecipe: お気に入りを追加");

  await addHistoryEntry({ uid, recipe: sampleRecipe });
  console.log("addHistoryEntry: 履歴を追加");

  await removeFavoriteRecipe({ uid, recipeId: sampleRecipe.id });
  console.log("removeFavoriteRecipe: お気に入りを削除");

  const finalProfile = await getUserProfile(uid);
  console.log("最終結果:", finalProfile);
  console.log("=== Firestore helper テスト完了 ===");
}

main().catch((error) => {
  console.error("テストに失敗しました", error);
  process.exit(1);
});

