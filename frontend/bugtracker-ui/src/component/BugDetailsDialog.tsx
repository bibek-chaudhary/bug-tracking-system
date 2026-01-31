import { useState } from "react";
import { useDevelopers } from "../hooks/useDevelopers";
import { getImageUrl } from "../utils/getImageUrl";
import { useAssignBug, useBugDetails } from "../hooks/useBugQueries";
import type { Developer } from "../types/user.type";
import {
  BugSeverityMap,
  BugStatusMap,
  type Attachments,
  type BugSeverity,
  type BugStatus,
} from "../types/bug.types";
import toast from "react-hot-toast";
import { getUserRole } from "../utils/authHelp";

interface Props {
  bugId: string | null;
  onClose: () => void;
}

const BugDetailsDialog: React.FC<Props> = ({ bugId, onClose }) => {
  const [selectedDev, setSelectedDev] = useState("");
  const { data, refetch } = useBugDetails(bugId ?? "");
  const { data: developersData } = useDevelopers();
  const role = getUserRole();
  const assignBug = useAssignBug();

  if (!bugId) return null;

  const bug = data?.data;

  const handleAssign = async () => {
    if (!selectedDev || !bug) return;
    try {
      const res = await assignBug.mutateAsync({
        bugId: bug.id,
        developerId: selectedDev,
      });
      setSelectedDev("");
      console.log("res", res);
      toast.success(res.message);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative">
        <div className="sticky top-0 bg-white z-10 border-b px-6 py-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {bug?.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Bug Details</p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {BugStatusMap[bug?.status as BugStatus] ?? "N/A"}
              </span>
            </div>

            <div>
              <p className="text-gray-500">Severity</p>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                {BugSeverityMap[bug?.severity as BugSeverity]}
              </span>
            </div>

            <div>
              <p className="text-gray-500">Assigned Developer</p>
              <p className="font-medium text-gray-800 mt-1">
                {bug?.assignedToUserName ?? "Not assigned"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Assigned At</p>
              <p className="font-medium text-gray-800 mt-1">
                {bug?.assignedAt
                  ? new Date(bug.assignedAt).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {bug?.description}
            </p>
          </div>

          {role === "User" && bug?.assignedToUserId === null && (
            <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
              {developersData?.length ? (
                <select
                  value={selectedDev}
                  onChange={(e) => setSelectedDev(e.target.value)}
                  className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select Developer</option>
                  {developersData.map((dev: Developer) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.name ?? "Unnamed"}
                    </option>
                  ))}
                </select>
              ) : (
                <span>No any developer to assignBug</span>
              )}

              <button
                disabled={!selectedDev}
                onClick={handleAssign}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {assignBug.isPending ? "Assigning..." : "Assign"}
              </button>
            </div>
          )}

          {bug?.attachments?.length ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Attachments
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {bug.attachments.map((a: Attachments, index) => (
                  <a
                    key={index}
                    href={getImageUrl(a.filePath)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <img
                      src={getImageUrl(a.filePath)}
                      alt={`attachment-${index}`}
                      className="w-full h-24 object-cover rounded-lg border group-hover:scale-105 transition"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BugDetailsDialog;
