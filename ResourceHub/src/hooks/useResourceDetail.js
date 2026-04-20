import { useCallback, useEffect, useState } from "react";
import {
  deleteResource,
  fetchResourceById,
  updateResource,
  uploadResourceFile,
} from "../services/resourceService";
import {
  addComment,
  deleteComment,
  fetchCommentsByResource,
} from "../services/commentService";

export function useResourceDetail(resourceId) {
  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDetail = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }
      setError("");
      const [resourceData, commentData] = await Promise.all([
        fetchResourceById(resourceId),
        fetchCommentsByResource(resourceId),
      ]);
      setResource(resourceData);
      setComments(commentData);
    } catch (detailError) {
      setError(detailError.message || "Failed to load resource details");
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [resourceId]);

  useEffect(() => {
    if (!resourceId) return;
    loadDetail();
  }, [resourceId, loadDetail]);

  const editResource = useCallback(
    async (updates, file) => {
      if (!resource) return;

      const dataToUpdate = { ...updates };
      if (file) {
        const uploadResult = await uploadResourceFile(file, resource.createdBy);
        dataToUpdate.fileUrl = uploadResult.fileUrl;
        dataToUpdate.storagePath = uploadResult.storagePath;
      }

      await updateResource(resource.id, dataToUpdate);
      await loadDetail(false);
    },
    [loadDetail, resource]
  );

  const removeResource = useCallback(async () => {
    if (!resource) return;
    await deleteResource(resource);
  }, [resource]);

  const createComment = useCallback(
    async (user, text) => {
      if (!text.trim()) return;
      const trimmedText = text.trim();
      const commentId = await addComment(resourceId, user, trimmedText);

      setComments((prev) => [
        ...prev,
        {
          id: commentId,
          resourceId,
          userId: user.uid,
          userEmail: user.email || "",
          text: trimmedText,
          createdAt: { toMillis: () => Date.now() },
        },
      ]);
    },
    [resourceId]
  );

  const removeComment = useCallback(
    async (comment) => {
      await deleteComment(comment);
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    },
    []
  );

  return {
    resource,
    comments,
    loading,
    error,
    reload: loadDetail,
    editResource,
    removeResource,
    createComment,
    removeComment,
  };
}
