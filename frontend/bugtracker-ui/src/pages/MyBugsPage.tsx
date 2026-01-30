import { useEffect, useState } from "react";
import type {
  BugListItem,
  PagedResult,
  BugQueryParams,
} from "../types/bug.types";
import { bugsApi } from "../api/bug.api";
import BugFilters from "../component/BugFilters";
import BugTable from "../component/BugTable";
import Pagination from "../component/Pagination";

const MyBugsPage: React.FC = () => {
  const [data, setData] = useState<PagedResult<BugListItem>>();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Partial<BugQueryParams>>({});

  let isMounted = true;

  const loadBugs = async () => {
    try {
      const result = await bugsApi.getMyBugs({
        page,
        pageSize: 10,
        sortBy,
        sortOrder,
        ...filters,
      });

      console.log("result", result);

      if (isMounted) {
        setData((prev: any) => {
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

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

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

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">My Bugs</h1>

      <BugFilters
        onFilterChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
      />

      {data && data?.items?.length > 0 && (
        <>
          <BugTable
            bugs={data.items}
            onSort={handleSort}
            onAssign={handleAssign}
          />
          <Pagination
            page={data.page}
            pageSize={data.pageSize}
            totalCount={data.totalCount}
            onPageChange={setPage}
          />
        </>
      )}

      {data && data.items.length === 0 && (
        <p className="text-gray-500">No bugs found.</p>
      )}
    </div>
  );
};

export default MyBugsPage;
