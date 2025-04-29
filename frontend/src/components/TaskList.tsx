import type { Task } from "../types/task";
import { useNavigate, useSearchParams } from "react-router-dom";

interface TaskListProps {
  tasks: Task[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TaskList({
  tasks,
  currentPage,
  totalPages,
  onPageChange,
}: TaskListProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getStatusColor = (task: Task) => {
    if (task.completedAt) return "bg-green-100 text-green-800";
    if (task.failedAt) return "bg-red-100 text-red-800";
    if (task.startedAt) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = (task: Task) => {
    if (task.completedAt) return "Completed";
    if (task.failedAt) return "Failed";
    if (task.startedAt) return "In Progress";
    return "Pending";
  };

  const handleTaskClick = (taskId: number) => {
    // Create new params for the task details page that include the return page and status
    const params = new URLSearchParams();
    params.set("returnPage", currentPage.toString());
    const status = searchParams.get("status");
    if (status) params.set("returnStatus", status);

    navigate(`/tasks/${taskId}?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTaskClick(task.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {task.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {task.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task)}`}
                  >
                    {getStatusText(task)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between gap-2 sm:hidden">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            First
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Last
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex space-x-2"
              aria-label="Pagination"
            >
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                First
              </button>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Last
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
