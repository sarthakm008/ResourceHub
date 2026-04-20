import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchAllResources,
  fetchBookmarkedResourceIds,
  fetchResourcesByIds,
  fetchResourcesByUser,
  toggleResourceBookmark,
  toggleResourceUpvote,
} from "../services/resourceService";

export function useResources(currentUser, options = {}) {
  const autoLoad = options.autoLoad !== false;
  const bookmarkSyncRef = useRef(0);
  const [resources, setResources] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const loadResources = useCallback(async () => {
    const syncId = ++bookmarkSyncRef.current;
    try {
      setLoading(true);
      setError("");
      const items = await fetchAllResources();
      setResources(items);
      if (currentUser?.uid) {
        const ids = await fetchBookmarkedResourceIds(currentUser.uid);
        if (syncId === bookmarkSyncRef.current) {
          setBookmarkedIds(ids);
        }
      } else {
        setBookmarkedIds([]);
      }
    } catch (loadError) {
      setError(loadError.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    if (!autoLoad) {
      setLoading(false);
      return;
    }
    loadResources();
  }, [autoLoad, loadResources]);

  const toggleUpvote = useCallback(
    async (resource) => {
      if (!currentUser) return;
      const hasUpvoted = (resource.upvotes || []).includes(currentUser.uid);
      setResources((prev) =>
        prev.map((item) =>
          item.id !== resource.id
            ? item
            : {
                ...item,
                upvotes: hasUpvoted
                  ? (item.upvotes || []).filter((id) => id !== currentUser.uid)
                  : [...(item.upvotes || []), currentUser.uid],
              }
        )
      );
      try {
        await toggleResourceUpvote(resource.id, currentUser.uid, hasUpvoted);
      } catch (updateError) {
        setError(updateError.message || "Failed to update upvote");
        if (autoLoad) {
          await loadResources();
        }
      }
    },
    [autoLoad, currentUser, loadResources]
  );

  const toggleBookmark = useCallback(
    async (resource) => {
      if (!currentUser) return;
      const syncId = ++bookmarkSyncRef.current;
      const isBookmarked = bookmarkedIds.includes(resource.id);
      const optimisticIds = isBookmarked
        ? bookmarkedIds.filter((id) => id !== resource.id)
        : [...bookmarkedIds, resource.id];

      if (syncId !== bookmarkSyncRef.current) return;
      setBookmarkedIds(optimisticIds);
      setResources((prev) =>
        prev.map((item) =>
          item.id !== resource.id
            ? item
            : {
                ...item,
                bookmarkedBy: optimisticIds.includes(item.id)
                  ? [...new Set([...(item.bookmarkedBy || []), currentUser.uid])]
                  : (item.bookmarkedBy || []).filter((id) => id !== currentUser.uid),
              }
        )
      );

      try {
        await toggleResourceBookmark(resource.id, currentUser.uid, isBookmarked);
        const nextIds = await fetchBookmarkedResourceIds(currentUser.uid);
        if (syncId !== bookmarkSyncRef.current) return;
        setBookmarkedIds(nextIds);
        setResources((prev) =>
          prev.map((item) =>
            item.id !== resource.id
              ? item
              : {
                  ...item,
                  bookmarkedBy: nextIds.includes(item.id)
                    ? [...new Set([...(item.bookmarkedBy || []), currentUser.uid])]
                    : (item.bookmarkedBy || []).filter((id) => id !== currentUser.uid),
                }
          )
        );
      } catch (updateError) {
        setError(updateError.message || "Failed to update bookmark");
        if (syncId !== bookmarkSyncRef.current) return;
        setBookmarkedIds(bookmarkedIds);
        if (autoLoad) {
          await loadResources();
        }
      }
    },
    [autoLoad, currentUser, loadResources]
  );

  const resourceMap = useMemo(() => {
    const map = {};
    resources.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [resources]);

  const getMyResources = useCallback(async () => {
    if (!currentUser?.uid) return [];
    return fetchResourcesByUser(currentUser.uid);
  }, [currentUser?.uid]);

  const getBookmarkedResources = useCallback(async () => {
    if (!currentUser?.uid) return [];
    const ids = await fetchBookmarkedResourceIds(currentUser.uid);
    setBookmarkedIds(ids);
    return fetchResourcesByIds(ids);
  }, [currentUser?.uid]);

  return {
    resources,
    resourceMap,
    bookmarkedIds,
    loading,
    error,
    reload: loadResources,
    toggleUpvote,
    toggleBookmark,
    getMyResources,
    getBookmarkedResources,
  };
}
