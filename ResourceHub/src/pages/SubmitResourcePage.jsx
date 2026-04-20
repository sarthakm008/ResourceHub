import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubmitResource } from "../hooks/useSubmitResource";

const initialForm = {
  title: "",
  subject: "",
  semester: "",
  type: "",
  description: "",
  url: "",
};

export default function SubmitResourcePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { submitResource, submitting, error } = useSubmitResource();
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");
    const id = await submitResource(form, file, user);
    setSuccess("Resource submitted successfully");
    setForm(initialForm);
    clearFile();
    setTimeout(() => navigate(`/resources/${id}`), 500);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Submit Study Resource</h1>
        <p className="mt-1 text-sm text-slate-500">Share helpful material with other students</p>

        <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="title" placeholder="Title" value={form.title} onChange={onChange} required />
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="subject" placeholder="Subject (e.g. Data Structures)" value={form.subject} onChange={onChange} required />
            <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="semester" placeholder="Semester (e.g. 4)" value={form.semester} onChange={onChange} required />
          </div>
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="type" placeholder="Type (notes, assignment, slides)" value={form.type} onChange={onChange} required />
          <textarea className="min-h-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="description" placeholder="Description" value={form.description} onChange={onChange} required />
          <input className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500" name="url" placeholder="External URL (optional)" value={form.url} onChange={onChange} />

          <div className="rounded-lg border border-dashed border-slate-300 p-4">
            <label className="block text-sm font-medium text-slate-600">Upload file (optional)</label>
            <input ref={fileInputRef} type="file" className="mt-2 w-full text-sm text-slate-600" onChange={onFileChange} />
            {file && (
              <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                <span>{file.name}</span>
                <button type="button" onClick={clearFile} className="font-medium text-red-500">
                  Remove
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? "Submitting..." : "Submit Resource"}
          </button>
        </form>
      </div>
    </div>
  );
}
