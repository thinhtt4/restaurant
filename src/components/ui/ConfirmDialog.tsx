import { X } from "lucide-react";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title = "Xác nhận",
  description = "Bạn có chắc chắn không?",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{title}</h3>
          <button onClick={onCancel} className="p-1 rounded hover:bg-gray-100">
            <X />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-700">{description}</p>
        </div>
        <div className="p-4 flex justify-end gap-2 border-t">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-100 rounded">
            Không
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Có
          </button>
        </div>
      </div>
    </div>
  );
}
