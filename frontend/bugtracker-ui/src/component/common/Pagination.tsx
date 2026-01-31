interface Props {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, pageSize, totalCount, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  if (totalPages < 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 px-4 py-3 bg-white rounded-2xl shadow">
      <div className="text-sm text-gray-600 text-center sm:text-left">
        Showing{" "}
        <span className="font-semibold text-gray-800">{start}–{end}</span>{" "}
        of <span className="font-semibold text-gray-800">{totalCount}</span> bugs
      </div>

      <div className="flex justify-center sm:justify-end items-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 sm:px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-600">
          Page{" "}
          <span className="font-semibold text-gray-800">{page}</span> of{" "}
          <span className="font-semibold text-gray-800">{totalPages}</span>
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 sm:px-4 py-2 text-sm font-medium border rounded-lg bg-white hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
