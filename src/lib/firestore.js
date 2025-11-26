import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { format } from "date-fns";
import { db } from "./firebase.js";

const USERS_COLLECTION = "users";

const userDocRef = (uid) => doc(db, USERS_COLLECTION, uid);

const handleFirestoreError = (action, error) => {
  console.error(`[firestore.${action}]`, error);
  throw new Error(`ユーザーデータの${action}に失敗しました`);
};

export async function createUserProfile({ uid, email, name }) {
  try {
    if (!uid) throw new Error("uidが指定されていません");
    const ref = userDocRef(uid);
    const timestamp = serverTimestamp();
    await setDoc(ref, {
      uid,
      email: email ?? "",
      name: name ?? "",
      favorites: [],
      histories: [],
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  } catch (error) {
    handleFirestoreError("createUserProfile", error);
  }
}

export async function getUserProfile(uid) {
  try {
    if (!uid) throw new Error("uidが指定されていません");
    const snapshot = await getDoc(userDocRef(uid));
    if (!snapshot.exists()) return null;
    return { uid: snapshot.id, ...snapshot.data() };
  } catch (error) {
    handleFirestoreError("getUserProfile", error);
  }
}

export async function upsertFavoriteRecipe({ uid, recipe }) {
  try {
    if (!uid) throw new Error("uidが指定されていません");
    if (!recipe?.id) throw new Error("recipe.id が必要です");
    const snapshot = await getDoc(userDocRef(uid));
    if (!snapshot.exists())
      throw new Error("ユーザープロファイルが存在しません");

    const currentFavorites = snapshot.data().favorites ?? [];
    const savedAt = format(new Date(), "yyyy-MM-dd");
    const filtered = currentFavorites.filter((item) => item.id !== recipe.id);
    const nextFavorites = [{ ...recipe, savedAt }, ...filtered];

    await updateDoc(userDocRef(uid), {
      favorites: nextFavorites,
      updatedAt: serverTimestamp(),
    });

    return nextFavorites;
  } catch (error) {
    handleFirestoreError("upsertFavoriteRecipe", error);
  }
}

export async function removeFavoriteRecipe({ uid, recipeId }) {
  try {
    if (!uid) throw new Error("uidが指定されていません");
    if (!recipeId) throw new Error("recipeId が必要です");

    const snapshot = await getDoc(userDocRef(uid));
    if (!snapshot.exists())
      throw new Error("ユーザープロファイルが存在しません");

    const currentFavorites = snapshot.data().favorites ?? [];
    const nextFavorites = currentFavorites.filter(
      (item) => item.id !== recipeId
    );

    await updateDoc(userDocRef(uid), {
      favorites: nextFavorites,
      updatedAt: serverTimestamp(),
    });

    return nextFavorites;
  } catch (error) {
    handleFirestoreError("removeFavoriteRecipe", error);
  }
}

export async function addHistoryEntry({ uid, recipe }) {
  try {
    if (!uid) throw new Error("uidが指定されていません");
    if (!recipe?.id) throw new Error("recipe.id が必要です");

    const snapshot = await getDoc(userDocRef(uid));
    if (!snapshot.exists())
      throw new Error("ユーザープロファイルが存在しません");

    const currentHistories = snapshot.data().histories ?? [];
    const entryDate = format(new Date(), "yyyy-MM-dd");
    const nextHistories = [{ ...recipe, date: entryDate }, ...currentHistories];

    await updateDoc(userDocRef(uid), {
      histories: nextHistories,
      updatedAt: serverTimestamp(),
    });

    return nextHistories;
  } catch (error) {
    handleFirestoreError("addHistoryEntry", error);
  }
}
