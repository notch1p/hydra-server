import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TaskDetails } from "../components/TaskDetails";
import { getTaskById } from "../services/api";
import type { Task } from "../types/task";

export function TaskView() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      if (!id) return;

      try {
        setLoading(true);
        const taskData = await getTaskById(parseInt(id));
        setTask(taskData);
        setError(null);
      } catch (err) {
        setError("Failed to load task details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TaskDetails task={task} />
    </div>
  );
}
