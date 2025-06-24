import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, collection } from "firebase/firestore";
import { auth, db } from "../utilities/firebase";


export const handleSubmit = async ({
  e,
  isRegistering,
  email,
  password,
  navigate,
  setError,
}) => {
  e.preventDefault();

  try {
    if (isRegistering) {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });

      // Initial trade
      await setDoc(doc(collection(db, "users", user.uid, "trades"), "initialTrade"), {
        coin: "Filler text",
        bought: 0,
        sold: 0,
        difference: 0,
        profits: 0,
        dateEntered: new Date().toISOString(),
        dateSold: null,
        tradeLasted: null,
        ongoing: true,
      });

      navigate("/trades");
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/trades");
    }
  } catch (err) {
    setError(err.message);
  }
}