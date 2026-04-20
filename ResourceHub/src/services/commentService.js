import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const commentsRef = collection(db, "comments");

export async function addComment(resourceId, user, text) {
  const commentDoc = await addDoc(commentsRef, {
    resourceId,
    userId: user.uid,
    userEmail: user.email || "",
    text: text.trim(),
    createdAt: serverTimestamp(),
  });

  try {
    await updateDoc(doc(db, "resources", resourceId), {
      commentCount: increment(1),
    });
  } catch (error) {
    // Keep comment creation successful even if counter update is blocked by rules.
  }

  return commentDoc.id;
}

export async function deleteComment(comment) {
  await deleteDoc(doc(db, "comments", comment.id));
  try {
    await updateDoc(doc(db, "resources", comment.resourceId), {
      commentCount: increment(-1),
    });
  } catch (error) {
    // Keep comment deletion successful even if counter update is blocked by rules.
  }
}

export async function fetchCommentsByResource(resourceId) {
  const q = query(commentsRef, where("resourceId", "==", resourceId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((commentDoc) => ({
      id: commentDoc.id,
      ...commentDoc.data(),
    }))
    .sort((a, b) => {
      const aMs = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bMs = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return aMs - bMs;
    });
}
