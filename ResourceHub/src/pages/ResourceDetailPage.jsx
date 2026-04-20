import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useResourceDetail } from "../hooks/useResourceDetail";
import { useResources } from "../hooks/useResources";

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { resource, comments, loading, error, createComment, removeComment, removeResource } = useResourceDetail(id);
  const { bookmarkedIds, toggleBookmark, toggleUpvote } = useResources(user);
  const [commentText, setCommentText] = useState("");

  const isOwner = useMemo(() => {
    if (!resource || !user) return false;
    return resource.createdBy === user.uid;
  }, [resource, user]);

  const hasUpvoted = useMemo(() => {
    if (!resource || !user) return false;
    return (resource.upvotes || []).includes(user.uid);
  }, [resource, user]);

  const isBookmarked = bookmarkedIds.includes(id);

  const onDeleteResource = async () => {
    await removeResource();
    navigate("/feed");
  };

  const onAddComment = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    await createComment(user, commentText);
    setCommentText("");
  };

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-6">Loading resource...</div>;
  if (error) return <div className="mx-auto max-w-4xl px-4 py-6 text-red-600">{error}</div>;
  if (!resource) return <div className="mx-auto max-w-4xl px-4 py-6">Resource not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{resource.title}</h1>
            <p className="mt-2 text-sm text-slate-500">
              {resource.subject} • Semester {resource.semester} • {resource.type}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggleUpvote(resource)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
              {hasUpvoted ? "Un-upvote" : "Upvote"} ({resource.upvotes?.length || 0})
            </button>
            <button onClick={() => toggleBookmark(resource)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
              {isBookmarked ? "Unbookmark" : "Bookmark"}
            </button>
          </div>
        </div>

        <p className="mt-4 whitespace-pre-line text-slate-700">{resource.description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          {resource.url && (
            <a className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" href={resource.url} target="_blank" rel="noreferrer">
              Open URL
            </a>
          )}
          {resource.fileUrl && (
            <a className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" href={resource.fileUrl} target="_blank" rel="noreferrer">
              View File
            </a>
          )}
          {isOwner && (
            <>
              <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to={`/resources/${resource.id}/edit`}>
                Edit
              </Link>
              <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50" onClick={onDeleteResource}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
        <form className="mt-3 flex gap-2" onSubmit={onAddComment}>
          <input
            className="flex-1 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            placeholder="Add a comment"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
          <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Post
          </button>
        </form>

        {!comments.length && <p className="mt-4 text-sm text-slate-500">No comments yet.</p>}

        <div className="mt-4 space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-lg border border-slate-100 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-slate-700">{comment.text}</p>
                {user?.uid === comment.userId && (
                  <button className="text-xs font-medium text-red-500" onClick={() => removeComment(comment)}>
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-400">{comment.userEmail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
