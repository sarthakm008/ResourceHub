import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ResourceCard from "../components/ResourceCard";
import { useAuth } from "../context/AuthContext";
import { useResources } from "../hooks/useResources";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    getMyResources,
    getBookmarkedResources,
    bookmarkedIds,
    toggleBookmark,
    toggleUpvote,
  } = useResources(user, { autoLoad: false });
  const [myResources, setMyResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const updateResourceInLists = (resourceId, updater) => {
    setMyResources((prev) =>
      prev.map((item) => (item.id === resourceId ? updater(item) : item))
    );
    setBookmarks((prev) =>
      prev.map((item) => (item.id === resourceId ? updater(item) : item))
    );
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const [mine, saved] = await Promise.all([getMyResources(), getBookmarkedResources()]);
        setMyResources(mine);
        setBookmarks(saved);
      } catch (loadError) {
        setError(loadError.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [getBookmarkedResources, getMyResources]);

  const handleUpvote = async (resource) => {
    if (!user?.uid) return;
    const hasUpvoted = (resource.upvotes || []).includes(user.uid);
    updateResourceInLists(resource.id, (item) => ({
      ...item,
      upvotes: hasUpvoted
        ? (item.upvotes || []).filter((id) => id !== user.uid)
        : [...(item.upvotes || []), user.uid],
    }));
    await toggleUpvote(resource);
  };

  const handleBookmark = async (resource) => {
    if (!user?.uid) return;
    const isBookmarked = bookmarkedIds.includes(resource.id);
    if (isBookmarked) {
      setBookmarks((prev) => prev.filter((item) => item.id !== resource.id));
    } else {
      setBookmarks((prev) => [resource, ...prev]);
    }
    await toggleBookmark(resource);
    const latestBookmarks = await getBookmarkedResources();
    setBookmarks(latestBookmarks);
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-4 py-6">Loading dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your submissions and bookmarks</p>
      {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">My Submissions</h2>
          <Link to="/submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            New Resource
          </Link>
        </div>
        {!myResources.length && (
          <div className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">You have not submitted any resources yet.</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isBookmarked={bookmarkedIds.includes(resource.id)}
              onUpvote={() => handleUpvote(resource)}
              onBookmark={() => handleBookmark(resource)}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Bookmarked Resources</h2>
        {!bookmarks.length && (
          <div className="rounded-xl bg-white p-6 text-slate-500 shadow-sm">No bookmarks yet.</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isBookmarked={bookmarkedIds.includes(resource.id)}
              onUpvote={() => handleUpvote(resource)}
              onBookmark={() => handleBookmark(resource)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
