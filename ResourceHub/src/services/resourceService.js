import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  documentId,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "./firebase";

const resourcesRef = collection(db, "resources");

export async function uploadResourceFile(file, userId) {
  const storagePath = `resources/${userId}/${Date.now()}-${file.name}`;
  const fileRef = ref(storage, storagePath);
  await uploadBytes(fileRef, file);
  const fileUrl = await getDownloadURL(fileRef);
  return { fileUrl, storagePath };
}

export async function deleteResourceFile(storagePath) {
  if (!storagePath) return;
  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}

export async function createResource(resourceData, user) {
  const payload = {
    ...resourceData,
    createdBy: user.uid,
    creatorEmail: user.email || "",
    upvotes: [],
    bookmarkedBy: [],
    commentCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const resourceDoc = await addDoc(resourcesRef, payload);
  return resourceDoc.id;
}

export async function fetchAllResources() {
  const q = query(resourcesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((resourceDoc) => ({
    id: resourceDoc.id,
    ...resourceDoc.data(),
  }));
}

export async function fetchResourceById(resourceId) {
  const resourceDoc = await getDoc(doc(db, "resources", resourceId));
  if (!resourceDoc.exists()) return null;
  return { id: resourceDoc.id, ...resourceDoc.data() };
}

export async function fetchResourcesByUser(userId) {
  const q = query(resourcesRef, where("createdBy", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((resourceDoc) => ({
      id: resourceDoc.id,
      ...resourceDoc.data(),
    }))
    .sort((a, b) => {
      const aMs = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bMs = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bMs - aMs;
    });
}

export async function updateResource(resourceId, updates) {
  await updateDoc(doc(db, "resources", resourceId), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteResource(resource) {
  await deleteDoc(doc(db, "resources", resource.id));
  if (resource.storagePath) {
    await deleteResourceFile(resource.storagePath);
  }
}

export async function toggleResourceUpvote(resourceId, userId, hasUpvoted) {
  await updateDoc(doc(db, "resources", resourceId), {
    upvotes: hasUpvoted ? arrayRemove(userId) : arrayUnion(userId),
  });
}

export async function toggleResourceBookmark(resourceId, userId, isBookmarked) {
  const userDocRef = doc(db, "users", userId);
  const resourceDocRef = doc(db, "resources", resourceId);

  if (isBookmarked) {
    await setDoc(
      userDocRef,
      { bookmarks: { [resourceId]: false }, updatedAt: serverTimestamp() },
      { merge: true }
    );
    try {
      await updateDoc(resourceDocRef, { bookmarkedBy: arrayRemove(userId) });
    } catch (error) {
      // Keep bookmark persistence reliable even if resource update is blocked by rules.
    }
  } else {
    await setDoc(
      userDocRef,
      { bookmarks: { [resourceId]: true }, updatedAt: serverTimestamp() },
      { merge: true }
    );
    try {
      await updateDoc(resourceDocRef, { bookmarkedBy: arrayUnion(userId) });
    } catch (error) {
      // Keep bookmark persistence reliable even if resource update is blocked by rules.
    }
  }
}

export async function fetchBookmarkedResourceIds(userId) {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) return [];
  const bookmarks = userDoc.data().bookmarks || {};
  return Object.keys(bookmarks).filter((key) => bookmarks[key]);
}

export async function fetchResourcesByIds(resourceIds) {
  if (!resourceIds.length) return [];
  const chunks = [];
  for (let index = 0; index < resourceIds.length; index += 10) {
    chunks.push(resourceIds.slice(index, index + 10));
  }

  const snapshots = await Promise.all(
    chunks.map((chunk) =>
      getDocs(query(resourcesRef, where(documentId(), "in", chunk)))
    )
  );

  return snapshots
    .flatMap((snapshot) =>
      snapshot.docs.map((resourceDoc) => ({
        id: resourceDoc.id,
        ...resourceDoc.data(),
      }))
    )
    .sort((a, b) => {
      const aMs = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bMs = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bMs - aMs;
    });
}
