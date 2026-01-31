import {
  BugSeverityMap,
  BugStatusMap,
  type BugSeverity,
  type BugStatus,
  type MyBug,
} from "../../types/bug.types";
import { getUserRole } from "../../utils/authHelp";

interface Props {
  bugs: MyBug[];
  onSort: (field: string) => void;
  onAssign?: (bugId: string) => void;
  onview: (id: string) => void;
  onUpdateStatus?: (bugId: string, status: number) => void;
  onCloseBug?: (bugId: string) => void;
}

const BugTable: React.FC<Props> = ({
  bugs,
  onSort,
  onAssign,
  onview,
  onUpdateStatus,
  onCloseBug,
}) => {
  const role = getUserRole();

  const statusOptions = [
    { label: "Open", value: 1 },
    { label: "In Progress", value: 2 },
    { label: "Resolved", value: 3 },
  ];

  return (
    <div className="w-full h-full rounded-2xl shadow bg-white">
      {/* Desktop Table */}
      <div className="hidden md:block w-full h-full overflow-x-auto">
        <div className="h-full overflow-y-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">
              <tr>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => onSort("title")}
                >
                  Title
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => onSort("severity")}
                >
                  Severity
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => onSort("status")}
                >
                  Status
                </th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-gray-200 transition"
                  onClick={() => onSort("createdAt")}
                >
                  Created At
                </th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {bugs.map((bug) => (
                <tr
                  key={bug.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{bug.title}</td>
                  <td className="p-3">
                    {BugSeverityMap[bug.severity as unknown as BugSeverity]}
                  </td>
                  <td className="p-3">
                    {role === "Developer" && bug.status !== 4 ? (
                      <select
                        value={bug.status}
                        onChange={(e) =>
                          onUpdateStatus?.(bug.id, Number(e.target.value))
                        }
                        className="border p-1 rounded"
                      >
                        {statusOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      (BugStatusMap[bug.status as unknown as BugStatus] ??
                      "N/A")
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {role === "Developer" && !bug.assignedToUserId && (
                      <button
                        onClick={() => onAssign?.(bug.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                      >
                        Assign to me
                      </button>
                    )}
                    <button
                      onClick={() => onview(bug.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    {role === "User" && bug.status === 3 && (
                      <button
                        onClick={() => onCloseBug?.(bug.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Close Bug
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4 p-4">
        {bugs.map((bug) => (
          <div key={bug.id} className="border rounded-xl shadow p-4 bg-white">
            <h3 className="text-lg font-semibold">{bug.title}</h3>
            <p>
              <strong>Severity:</strong>{" "}
              {BugSeverityMap[bug.severity as unknown as BugSeverity]}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {role === "Developer" && bug.status !== 4 ? (
                <select
                  value={bug.status}
                  onChange={(e) =>
                    onUpdateStatus?.(bug.id, Number(e.target.value))
                  }
                  className="border p-1 rounded mt-1"
                >
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ) : (
                (BugStatusMap[bug.status as unknown as BugStatus] ?? "N/A")
              )}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(bug.createdAt).toLocaleDateString()}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {role === "Developer" && !bug.assignedToUserId && (
                <button
                  onClick={() => onAssign?.(bug.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
                >
                  Assign to me
                </button>
              )}
              <button
                onClick={() => onview(bug.id)}
                className="text-blue-600 hover:underline"
              >
                View
              </button>
              {role === "User" && bug.status === 3 && (
                <button
                  onClick={() => onCloseBug?.(bug.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Close Bug
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BugTable;
