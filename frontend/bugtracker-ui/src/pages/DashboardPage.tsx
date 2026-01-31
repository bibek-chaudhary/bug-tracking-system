import { useState } from "react";
import {
  useAssignToSelf,
  useCloseBug,
  useMyBugs,
  useUpdateBugStatus,
} from "../hooks/useBugQueries";
import type {
  BugFilterQuery,
  PaginationQuery,
  SortQuery,
} from "../types/bug.types";
import BugFilters from "../component/BugFilters";
import BugTable from "../component/common/Table";
import Pagination from "../component/common/Pagination";
import { getUserRole } from "../utils/authHelp";
import BugDetailsDialog from "../component/BugDetailsDialog";
import Layout from "../component/layouts/Layout";
import toast from "react-hot-toast";
import PageContainer from "../component/layouts/PageContainer";

const DashboardPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Partial<BugFilterQuery>>({});

  const [selectedBugId, setSelectedBugId] = useState<string | null>(null);

  const pagination: PaginationQuery = { page, pageSize };
  const sort: SortQuery = { sortBy, sortOrder };

  const role = getUserRole();

  const { mutateAsync: assignBugToSelf } = useAssignToSelf();

  const { data, isLoading, isError, refetch } = useMyBugs(
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

  const handleSelfAssign = async (bugId: string) => {
    const res = await assignBugToSelf(bugId);
    console.log(res);
    toast.success(res.message);
    refetch();
  };

  const handleFilterChange = (newFilters: Partial<BugFilterQuery>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const bugs = data?.data ?? [];
  const meta = data?.meta;

  const updateStatusMutation = useUpdateBugStatus();

  const handleUpdateStatus = async (bugId: string, status: number) => {
    try {
      const res = await updateStatusMutation.mutateAsync({
        id: bugId,
        status: status,
      });
      console.log(res);
      toast.success(res.message);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const closeBugMutation = useCloseBug();

  const handleCloseBug = async (bugId: string) => {
    try {
      const res = await closeBugMutation.mutateAsync(bugId);
      toast.success(res.message);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Layout>
        <PageContainer title={`Dashboard ${role}`}>
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
                  onUpdateStatus={handleUpdateStatus}
                  onCloseBug={handleCloseBug}
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

export default DashboardPage;
