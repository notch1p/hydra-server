export type TaskStatus = "pending" | "inProgress" | "completed" | "failed";

export interface Task {
  id: number;
  type: string;
  data: object;
  error: string | null;
  startedAt: string | null;
  failedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  failed: number;
  pending: number;
  inProgress: number;
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}
