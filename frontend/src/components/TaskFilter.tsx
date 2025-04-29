import { useNavigate } from "react-router-dom";

interface TaskFilterProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function TaskFilter({
  selectedStatus,
  onStatusChange,
}: TaskFilterProps) {
  const navigate = useNavigate();

  const handleTaskLookup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskId = (
      e.currentTarget.elements.namedItem("taskId") as HTMLInputElement
    ).value;
    if (taskId) {
      navigate(`/tasks/${taskId}`);
    }
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-6 sm:items-center sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <label
          htmlFor="status-filter"
          className="text-sm font-medium text-gray-700"
        >
          Filter by status:
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div className="hidden sm:block h-6 w-px bg-gray-300" />{" "}
      {/* Vertical divider - only show on desktop */}
      <div className="block sm:hidden h-px w-full bg-gray-300" />{" "}
      {/* Horizontal divider - only show on mobile */}
      <form
        onSubmit={handleTaskLookup}
        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3"
      >
        <label htmlFor="taskId" className="text-sm font-medium text-gray-700">
          Go to task:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            id="taskId"
            name="taskId"
            placeholder="Enter task ID"
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm px-4 py-2 w-full sm:w-32"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm cursor-pointer whitespace-nowrap"
          >
            Go
          </button>
        </div>
      </form>
    </div>
  );
}
