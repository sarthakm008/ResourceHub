import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useResourceDetail } from "../hooks/useResourceDetail";

export default function EditResourcePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { resource, loading, error, editResource } = useResourceDetail(id);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    semester: "",
    type: "",
    description: "",
    url: "",
  });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    if (!resource) return;
    setForm({
      title: resource.title || "",
      subject: resource.subject || "",
      semester: resource.semester || "",
      type: resource.type || "",
      description: resource.description || "",
      url: resource.url || "",
    });
  }, [resource]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!resource || user?.uid !== resource.createdBy) {
      setFormError("You can only edit your own resources.");
      return;
    }
    try {
      setSaving(true);
      setFormError("");
      await editResource(form, file);
      if (fileRef.current) fileRef.current.value = "";
      navigate(`/resources/${id}`);
    } catch (submitError) {
      setFormError(submitError.message || "Unable to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-3xl px-4 py-6">Loading resource...</div>;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-6 text-red-600">{error}</div>;
  if (!resource) return <div className="mx-auto max-w-3xl px-4 py-6">Resource not found.</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Edit Resource</h1>
        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="title" value={form.title} onChange={onChange} required />
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="subject" value={form.subject} onChange={onChange} required />
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="semester" value={form.semester} onChange={onChange} required />
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="type" value={form.type} onChange={onChange} required />
          <textarea className="min-h-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="description" value={form.description} onChange={onChange} required />
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="url" value={form.url} onChange={onChange} />
          <input ref={fileRef} type="file" onChange={onFileChange} />
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
