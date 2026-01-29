import { useEffect, useState } from "react";
import { bugsApi } from "../api/bug.api";
import type {
  BugListItem,
  BugQueryParams,
  PagedResult,
} from "../types/bug.types";
import BugFilters from "../component/BugFilters";

export default function UnassignedBugsPage() {
  const [bugs, setBugs] = useState<PagedResult<BugListItem>>();
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Partial<BugQueryParams>>({});

  useEffect(() => {
    setPage(1);
  }, [filters]);

  let isMounted = true;

  const loadBugs = async () => {
    try {
      const result = await bugsApi.getUnassignedBugs({
        page,
        pageSize: 10,
        sortBy,
        sortOrder,
        ...filters,
      });

      console.log("result", result.data);

      if (isMounted) {
        setBugs((prev: any) => {
          return {
            ...prev,
            items: result.data,
            totalCount: result.meta.totalCount,
            page: result.meta.page,
            pageSize: result.meta.pageSize,
          };
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    loadBugs();

    return () => {
      isMounted = false;
    };
  }, [page, sortBy, sortOrder, filters]);

  const handleSort = (field: string) => {
    setSortOrder(sortBy === field && sortOrder === "asc" ? "desc" : "asc");
    setSortBy(field);
  };

  const handleAssign = async (bugId: string) => {
    await bugsApi.assignBugToSelf(bugId);
    loadBugs();
  };

  useEffect(() => {
    loadBugs();
  }, []);

  //if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Unassigned Bugs</h1>
      <BugFilters
        onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
      />
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Severity</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {bugs &&
            bugs?.items?.length > 0 &&
            bugs?.items.map((bug) => (
              <tr key={bug.id}>
                <td className="p-2 border">{bug.title}</td>
                <td className="p-2 border">{bug.severity}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleAssign(bug.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Assign to me
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
