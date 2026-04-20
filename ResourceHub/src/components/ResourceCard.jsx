import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ResourceCard({ resource, onUpvote, onBookmark, isBookmarked }) {
  const { user } = useAuth();
  const hasUpvoted = !!user && (resource.upvotes || []).includes(user.uid);

  return (
    <article className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link to={`/resources/${resource.id}`} className="line-clamp-2 text-lg font-semibold text-slate-900 hover:text-blue-600">
            {resource.title}
          </Link>
          <p className="mt-1 text-xs text-slate-500">
            {resource.subject} • Semester {resource.semester} • {resource.type}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-sm text-slate-600">{resource.description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
              hasUpvoted ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            onClick={onUpvote}
          >
            {hasUpvoted ? "Un-upvote" : "Upvote"} ({resource.upvotes?.length || 0})
          </button>
          <button
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
              isBookmarked ? "border-yellow-200 bg-yellow-50 text-yellow-700" : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            onClick={onBookmark}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </button>
        </div>
        <Link to={`/resources/${resource.id}`} className="text-xs font-medium text-blue-600 hover:underline">
          Open
        </Link>
      </div>
    </article>
  );
}
