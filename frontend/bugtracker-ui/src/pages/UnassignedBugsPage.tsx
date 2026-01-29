import { useEffect, useState } from "react";
import { bugsApi } from "../api/bug.api";
import type {
  BugListItem,
  BugQueryParams,
  PagedResult,
} from "../types/bug.types";
import BugFilters from "../component/BugFilters";
import BugTable from "../component/BugTable";
import Pagination from "../component/Pagination";

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
      {bugs && bugs?.items?.length > 0 && (
        <>
          <BugTable bugs={bugs.items} onSort={handleSort} />
          <Pagination
            page={bugs.page}
            pageSize={bugs.pageSize}
            totalCount={bugs.totalCount}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
