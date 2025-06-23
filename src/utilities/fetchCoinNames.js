import {
  collection,
  getDocs
} from "firebase/firestore";

const fetchCoinNames = async (user, setExistingCoins, db) => {
  if (!user) return;
  try {
    const querySnapshot = await getDocs(
      collection(db, "users", user.uid, "trades")
    );
    const coins = new Set();
    querySnapshot.forEach((doc) => {
      coins.add(doc.data().coin);
    });
    setExistingCoins(Array.from(coins));
  } catch (err) {
    console.error("Error fetching coin names: ", err);
  }
};

export { fetchCoinNames };
