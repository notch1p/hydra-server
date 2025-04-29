import type { Task } from "../types/task";
import { useNavigate, useSearchParams } from "react-router-dom";

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBackClick = () => {
    // Preserve the page and status parameters when going back
    const params = new URLSearchParams();
    const page = searchParams.get("returnPage");
    const status = searchParams.get("returnStatus");

    if (page) params.set("page", page);
    if (status) params.set("status", status);

    navigate(`/?${params.toString()}`);
  };

  const getStatusColor = () => {
    if (task.completedAt) return "bg-green-100 text-green-800";
    if (task.failedAt) return "bg-red-100 text-red-800";
    if (task.startedAt) return "bg-blue-100 text-blue-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getStatusText = () => {
    if (task.completedAt) return "Completed";
    if (task.failedAt) return "Failed";
    if (task.startedAt) return "In Progress";
    return "Pending";
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <button
            onClick={handleBackClick}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Basic Information
          </h3>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor()}`}
                >
                  {getStatusText()}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Timeline</h3>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(task.createdAt).toLocaleString()}
              </dd>
            </div>
            {task.startedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Started</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(task.startedAt).toLocaleString()}
                </dd>
              </div>
            )}
            {task.completedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Completed</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(task.completedAt).toLocaleString()}
                </dd>
              </div>
            )}
            {task.failedAt && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Failed</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(task.failedAt).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {task.error && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Details
          </h3>
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{task.error}</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Task Data</h3>
        <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
          <code className="text-sm text-gray-700">
            {task.data
              ? JSON.stringify(
                  typeof task.data === "string"
                    ? JSON.parse(task.data)
                    : task.data,
                  null,
                  2,
                )
              : "No data"}
          </code>
        </pre>
      </div>
    </div>
  );
}
