import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

async function ensureUserDocument(authUser) {
  await setDoc(
    doc(db, "users", authUser.uid),
    {
      uid: authUser.uid,
      email: authUser.email || "",
      displayName: authUser.displayName || "",
      photoURL: authUser.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function signupWithEmail(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDocument(credential.user);
  return credential.user;
}

export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDocument(credential.user);
  return credential.user;
}

export async function loginWithGooglePopup() {
  const credential = await signInWithPopup(auth, googleProvider);
  await ensureUserDocument(credential.user);
  return credential.user;
}

export function logoutUser() {
  return signOut(auth);
}

export function subscribeToAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
