import { useState } from "react";
import { useAssignToSelf, useUnassignedBugs } from "../hooks/useBugQueries";
import type {
  BugFilterQuery,
  PaginationQuery,
  SortQuery,
} from "../types/bug.types";
import BugFilters from "../component/BugFilters";
import BugTable from "../component/common/Table";
import Pagination from "../component/common/Pagination";
import BugDetailsDialog from "../component/BugDetailsDialog";
import Layout from "../component/layouts/Layout";
import PageContainer from "../component/layouts/PageContainer";
import toast from "react-hot-toast";

const UnassignedBug: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Partial<BugFilterQuery>>({});
  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);

  const pagination: PaginationQuery = { page, pageSize };
  const sort: SortQuery = { sortBy, sortOrder };

  const { mutate: assignBugToSelf } = useAssignToSelf();

  const { data, isLoading, isError, refetch } = useUnassignedBugs(
    filters,
    pagination,
    sort,
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleSelfAssign = (bugId: string) => {
    assignBugToSelf(bugId, {
      onSuccess: (res) => {
        toast.success(res.message);
        refetch();
      },
      onError: (error) => console.error("Failed to assign bug", error),
    });
  };

  const handleFilterChange = (newFilters: Partial<BugFilterQuery>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const bugs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <Layout>
        <PageContainer title="Unassigned Bugs">
          <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="shrink-0">
              <BugFilters onFilterChange={handleFilterChange} />
            </div>

            <div className="flex-1 overflow-y-auto pr-1">
              {isLoading ? (
                <p>Loading bugs...</p>
              ) : isError ? (
                <p className="text-red-500">Error loading bugs.</p>
              ) : bugs.length > 0 ? (
                <BugTable
                  bugs={bugs}
                  onSort={handleSort}
                  onAssign={handleSelfAssign}
                  onview={(id) => setSelectedBugId(id)}
                />
              ) : (
                <p className="text-gray-500">No bugs found.</p>
              )}
            </div>

            {meta && (
              <div className="shrink-0 sticky bottom-0 bg-gray-100 pt-3">
                <Pagination
                  page={meta.page}
                  pageSize={meta.pageSize}
                  totalCount={meta.totalCount}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        </PageContainer>
      </Layout>

      <BugDetailsDialog
        bugId={selectedBugId}
        onClose={() => setSelectedBugId(null)}
      />
    </>
  );
};

export default UnassignedBug;
