import type { Task, TaskStats, PaginatedTasks } from "../types/task";

// In development, use the full URL. In production, use relative path
export const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "/api";

const getHeaders = () => {
  const authToken = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
};

export async function getTasks(
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<PaginatedTasks> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const response = await fetch(`${API_BASE_URL}/tasks?${params}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
}

export async function getTaskStats(): Promise<TaskStats> {
  const response = await fetch(`${API_BASE_URL}/tasks/stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch task stats");
  return response.json() as Promise<TaskStats>;
}

export async function getTaskById(id: number): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch task");
  return response.json() as Promise<Task>;
}
