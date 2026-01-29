import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { BugListItem } from "../types/bug.types";

interface Props {
  bugs: BugListItem[];
  onSort: (field: string) => void;
  onAssign?: (bugId: string) => Promise<void>;
}

const BugTable: React.FC<Props> = ({ bugs, onSort, onAssign }) => {
  const { role } = useAuth();
  return (
    <table className="w-full border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="p-2 cursor-pointer" onClick={() => onSort("title")}>
            Title
          </th>
          <th className="p-2 cursor-pointer" onClick={() => onSort("severity")}>
            Severity
          </th>
          <th className="p-2 cursor-pointer" onClick={() => onSort("status")}>
            Status
          </th>
          <th
            className="p-2 cursor-pointer"
            onClick={() => onSort("createdAt")}
          >
            Created At
          </th>
          <th className="p-2 border">Action</th>
        </tr>
      </thead>

      <tbody>
        {bugs.map((bug) => (
          <tr key={bug.id} className="border-t">
            <td className="p-2">{bug.title}</td>
            <td className="p-2">{bug.severity}</td>
            <td className="p-2">{bug.status}</td>
            <td className="p-2">
              {new Date(bug.createdAt).toLocaleDateString()}
            </td>
            <td className="p-2 border">
              <button
                onClick={() => onAssign?.(bug.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Assign to me
              </button>
              <Link to={`/bugs/${bug.id}`} className="text-blue-600 underline">
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default BugTable;
