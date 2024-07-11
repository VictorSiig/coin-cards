import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs3v26FSNKfeq89sUOAq6RrVrO5Lj1U1A",
  authDomain: "coin-cards-41856.firebaseapp.com",
  projectId: "coin-cards-41856",
  storageBucket: "coin-cards-41856.appspot.com",
  messagingSenderId: "1098704541496",
  appId: "1:1098704541496:web:fdb268806ea7c186cb93cd",
  measurementId: "G-LBYVKF35K6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };