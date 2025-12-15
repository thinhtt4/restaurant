interface Props {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}
export default function 
PaginationControls({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1 bg-white border rounded"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded ${
            p === page ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1 bg-white border rounded"
      >
        Next
      </button>
    </div>
  );
}
