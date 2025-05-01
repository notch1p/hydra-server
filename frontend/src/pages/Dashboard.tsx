import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { StatsCard } from "../components/StatsCard";
import { TaskList } from "../components/TaskList";
import { TaskFilter } from "../components/TaskFilter";
import { getTasks, getTaskStats } from "../services/api";
import type { TaskStats, PaginatedTasks } from "../types/task";

export function Dashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [tasks, setTasks] = useState<PaginatedTasks | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  // Get current page and status from URL
  const currentPage = parseInt(searchParams.get("page") || "1");
  const selectedStatus = searchParams.get("status") || "";

  // Function to fetch stats
  const fetchStats = async () => {
    try {
      const statsData = await getTaskStats();
      setStats(statsData);
      setError(null);
    } catch (err) {
      console.error("Failed to refresh stats:", err);
      // Don't set error state here to avoid showing error message for background refreshes
    }
  };

  // Function to fetch both stats and tasks
  const fetchAllData = async () => {
    const isRefetch = stats !== null && tasks !== null;
    try {
      if (isRefetch) {
        setIsRefetching(true);
      } else {
        setIsLoading(true);
      }

      const [statsData, tasksData] = await Promise.all([
        getTaskStats(),
        getTasks(currentPage, 10, selectedStatus || undefined),
      ]);
      setStats(statsData);
      setTasks(tasksData);
      setError(null);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
    }
  };

  // Initial data load and periodic stats refresh
  useEffect(() => {
    fetchAllData();

    // Set up interval for stats refresh
    const statsInterval = setInterval(fetchStats, 3_000);

    // Cleanup interval on unmount
    return () => clearInterval(statsInterval);
  }, [currentPage, selectedStatus]);

  // Only show loading screen on initial load
  if (isLoading && !stats && !tasks) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!stats || !tasks) {
    return null;
  }

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", "1");
    navigate(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
          Task Dashboard
        </h1>
        <button
          onClick={() => navigate("/database")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
        >
          Database Query
        </button>
      </div>
      <div className={isRefetching ? "opacity-60 pointer-events-none" : ""}>
        <StatsCard stats={stats} />
        <div className="mt-8">
          <TaskFilter
            selectedStatus={selectedStatus}
            onStatusChange={handleStatusChange}
          />
          <TaskList
            tasks={tasks.tasks}
            currentPage={currentPage}
            totalPages={Math.ceil(
              tasks.pagination.total / tasks.pagination.limit,
            )}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
