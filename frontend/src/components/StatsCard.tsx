import type { TaskStats } from "../types/task";

interface StatsCardProps {
  stats: TaskStats;
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <div className="bg-white px-4 py-3 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Total Tasks
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">
          {stats.total}
        </p>
      </div>
      <div className="bg-white px-4 py-3 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Completed
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-green-600">
          {stats.completed}
        </p>
      </div>
      <div className="bg-white px-4 py-3 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Failed
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-red-600">
          {stats.failed}
        </p>
      </div>
      <div className="bg-white px-4 py-3 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          Pending
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
          {stats.pending}
        </p>
      </div>
      <div className="bg-white px-4 py-3 sm:p-6 rounded-lg shadow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700">
          In Progress
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-blue-600">
          {stats.inProgress}
        </p>
      </div>
    </div>
  );
}
