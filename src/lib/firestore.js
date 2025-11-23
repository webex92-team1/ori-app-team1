// src/lib/firestore.js
import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  query,
  collection,
  limit,
  orderBy,
  where,
} from 'firebase/firestore';
import { format } from 'date-fns';

/**
 * Firestoreのエラーを共通で処理するラッパー関数
 * @param {string} functionName - エラーが発生した関数名
 * @param {Error} error - Firestoreからスローされたエラーオブジェクト
 * @throws {Error} 自前のErrorオブジェクト
 */
const handleError = (functionName, error) => {
  console.error(`[Firestore Error] in ${functionName}:`, error);
  throw new Error(`Failed to execute Firestore operation in ${functionName}.`);
};

/**
 * 新規ユーザーのFirestoreドキュメントを作成する。
 * @param {{uid: string, email: string, name: string}} userData - ユーザー情報
 * @returns {Promise<void>}
 */
export const createUserProfile = async ({ uid, email, name }) => {
  const functionName = 'createUserProfile';
  const docRef = doc(db, 'users', uid);
  const data = {
    uid,
    email,
    name,
    favorites: [],
    histories: [],
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(docRef, data);
  } catch (error) {
    handleError(functionName, error);
  }
};

/**
 * ユーザープロフィール情報を取得する。
 * @param {string} uid - ユーザーID
 * @returns {Promise<object | null>} ユーザーデータ、またはドキュメントが存在しない場合はnull
 */
export const getUserProfile = async (uid) => {
  const functionName = 'getUserProfile';
  const docRef = doc(db, 'users', uid);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // serverTimestamp()でFirestoreに保存された日付フィールドは、Dateオブジェクトとして取得される
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    handleError(functionName, error);
  }
};

/**
 * お気に入りレシピを追加する（重複防止付き）。
 * @param {{uid: string, recipe: object}} data - ユーザーIDとレシピオブジェクト
 * @returns {Promise<void>}
 */
export const upsertFavoriteRecipe = async ({ uid, recipe }) => {
  const functionName = 'upsertFavoriteRecipe';
  const docRef = doc(db, 'users', uid);

  // Firestoreの配列に追加するレシピオブジェクトには、recipeIdをキーとして含める
  const favoriteEntry = {
    recipeId: recipe.recipeId, // 楽天APIから取得するIDを想定
    title: recipe.title,
    imageUrl: recipe.imageUrl,
  };

  try {
    await updateDoc(docRef, {
      // arrayUnionは、配列に要素を追加する。
      // すでに同じ値（この場合はfavoriteEntryオブジェクト）が存在する場合は追加しないため、重複が防止できる
      favorites: arrayUnion(favoriteEntry),
    });
  } catch (error) {
    handleError(functionName, error);
  }
};

/**
 * お気に入りレシピを削除する。
 * @param {{uid: string, recipeId: string}} data - ユーザーIDと削除するレシピID
 * @returns {Promise<void>}
 */
export const removeFavoriteRecipe = async ({ uid, recipeId }) => {
  const functionName = 'removeFavoriteRecipe';
  const docRef = doc(db, 'users', uid);

  try {
    // ユーザープロファイルを取得し、favorites配列の中から該当のrecipeIdを持つ要素を見つける
    const profile = await getUserProfile(uid);
    if (!profile) {
      console.warn(`User profile not found for uid: ${uid}`);
      return;
    }

    const recipeToRemove = profile.favorites.find(
      (item) => item.recipeId === recipeId,
    );

    if (recipeToRemove) {
      // arrayRemoveは、指定した要素と完全に一致する要素を配列から削除する
      await updateDoc(docRef, {
        favorites: arrayRemove(recipeToRemove),
      });
    }
  } catch (error) {
    handleError(functionName, error);
  }
};

/**
 * 履歴にレシピを追加する（日付付き、新しい履歴を先頭に追加）。
 * @param {{uid: string, recipe: object}} data - ユーザーIDとレシピオブジェクト
 * @returns {Promise<void>}
 */
export const addHistoryEntry = async ({ uid, recipe }) => {
  const functionName = 'addHistoryEntry';
  const docRef = doc(db, 'users', uid);

  // 現在の日付を 'YYYY-MM-DD' 形式でフォーマット
  const date = format(new Date(), 'yyyy-MM-dd');

  const historyEntry = {
    recipeId: recipe.recipeId,
    title: recipe.title,
    imageUrl: recipe.imageUrl,
    viewedAt: date,
  };

  try {
    // ユーザープロファイルを取得
    const profile = await getUserProfile(uid);
    if (!profile) {
      console.warn(`User profile not found for uid: ${uid}`);
      return;
    }

    const currentHistories = profile.histories || [];

    // 既に履歴にあるかチェックし、あれば削除して最新にする
    const existingIndex = currentHistories.findIndex(
      (item) => item.recipeId === historyEntry.recipeId,
    );
    if (existingIndex !== -1) {
      currentHistories.splice(existingIndex, 1);
    }

    // 新しい履歴を配列の先頭に追加
    const newHistories = [historyEntry, ...currentHistories];

    // Firestoreを更新
    await updateDoc(docRef, {
      histories: newHistories,
    });
  } catch (error) {
    handleError(functionName, error);
  }
};