import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";

const db = getFirestore();

export const updateGamesCategoryState = async (cupId, newState) => {
  try {
    const cupRef = doc(db, "cups", cupId);
    const cupDoc = await getDoc(cupRef);
    if (!cupDoc.exists()) {
      console.error(`Cup document with id ${cupId} does not exist`);
      return;
    }
    const cupData = cupDoc.data();
    const categoriesToUpdate = [];
    cupData.gamesCategory.forEach((category) => {
      if (category.state !== newState) {
        categoriesToUpdate.push({ id: category.id, state: newState });
      }
    });
    if (categoriesToUpdate.length > 0) {
      const batch = writeBatch(db);
      categoriesToUpdate.forEach((category) => {
        console.log(category.id);
        console.log(newState);
        const categoryRef = doc(
          db,
          "cups",
          cupId,
          "gamesCategory",
          category.id
        );
        batch.update(categoryRef, { state: newState });
      });
      await batch.commit();
      console.log(
        `${categoriesToUpdate.length} categories updated successfully`
      );
    } else {
      console.log("No categories need to be updated");
    }
  } catch (error) {
    console.error("Error updating games category state: ", error);
  }
};
