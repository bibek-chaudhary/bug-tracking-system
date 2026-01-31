import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBug } from "../hooks/useBugQueries";
import Layout from "../component/layouts/Layout";
import PageContainer from "../component/layouts/PageContainer";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const ReportBugPage: React.FC = () => {
  const navigate = useNavigate();
  const createBugMutation = useCreateBug();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [reproductionSteps, setReproductionSteps] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await createBugMutation.mutateAsync({
        title,
        description,
        severity,
        reproductionSteps,
        attachments: files,
      });
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["myBugs"] });

      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit bug");
    }
  };

  return (
    <Layout>
      <PageContainer title="Report a Bug">
        <div className="max-w-xl bg-white shadow rounded-2xl p-6 mx-auto">
          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Bug title"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Bug description"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <select
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <textarea
              placeholder="Reproduction steps"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={reproductionSteps}
              onChange={(e) => setReproductionSteps(e.target.value)}
            />

            <input
              type="file"
              multiple
              className="w-full border border-gray-300 p-2 rounded-lg"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />

            <button
              type="submit"
              disabled={createBugMutation.isPaused}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createBugMutation.isPending ? "Submitting..." : "Submit Bug"}
            </button>
          </form>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default ReportBugPage;
