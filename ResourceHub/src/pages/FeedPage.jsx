import { useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useResources } from "../hooks/useResources";
import ResourceCard from "../components/ResourceCard";

export default function FeedPage() {
  const { user } = useAuth();
  const { resources, bookmarkedIds, loading, error, toggleUpvote, toggleBookmark } = useResources(user);
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const debounceRef = useRef(null);

  const subjects = useMemo(() => {
    const allSubjects = resources.map((item) => item.subject).filter(Boolean);
    return ["all", ...new Set(allSubjects)];
  }, [resources]);

  const resourceTypes = useMemo(() => {
    const allTypes = resources.map((item) => item.type).filter(Boolean);
    return ["all", ...new Set(allTypes)];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources
      .filter((item) => {
        if (subjectFilter === "all") return true;
        return item.subject === subjectFilter;
      })
      .filter((item) => {
        if (typeFilter === "all") return true;
        return item.type === typeFilter;
      })
      .filter((item) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.subject?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
  }, [query, resources, subjectFilter, typeFilter]);

  const onQueryChange = (event) => {
    const nextValue = event.target.value;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setQuery(nextValue);
    }, 250);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Resource Feed</h1>
        <p className="mt-1 text-sm text-slate-500">Discover useful study materials from students</p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            placeholder="Search by title, subject, or description"
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 md:col-span-2"
            onChange={onQueryChange}
          />
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            {resourceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="rounded-lg bg-white p-4 text-slate-600 shadow-sm">Loading resources...</p>}
      {error && <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>}

      {!loading && !error && !filteredResources.length && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
          No resources found. Try changing filters or submit one.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            isBookmarked={bookmarkedIds.includes(resource.id)}
            onUpvote={() => toggleUpvote(resource)}
            onBookmark={() => toggleBookmark(resource)}
          />
        ))}
      </div>
    </div>
  );
}
