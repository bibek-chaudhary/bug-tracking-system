import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { bugsApi } from "../api/bug.api";

const ReportBugPage: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [reproductionSteps, setReproductionSteps] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await bugsApi.reportBug({
        title,
        description,
        severity,
        reproductionSteps,
        attachments: files,
      });

      navigate("/user");
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Report a Bug</h1>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Bug title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Bug description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          className="w-full border p-2 rounded"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <textarea
          placeholder="Reproduction steps"
          className="w-full border p-2 rounded"
          value={reproductionSteps}
          onChange={(e) => setReproductionSteps(e.target.value)}
        />

        <input
          type="file"
          multiple
          className="w-full"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Bug"}
        </button>
      </form>
    </div>
  );
};

export default ReportBugPage;
