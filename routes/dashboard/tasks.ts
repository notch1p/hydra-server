import { db } from "../../db/db";
import { and, eq, isNotNull, isNull, SQL } from "drizzle-orm";
import { tasks } from "../../db/schema";
import { corsHeaders } from "../../middleware/cors";
import { authenticateRequest } from "../../middleware/auth";
import type { BunRequest } from "bun";

// Helper function to parse query parameters
function getQueryParams(url: string): Record<string, string> {
  const params = new URLSearchParams(new URL(url).search);
  return Object.fromEntries(params.entries());
}

export async function getTasks(req: Request) {
  if (!(await authenticateRequest(req))) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }
  const { page = "1", limit = "10", status } = getQueryParams(req.url);
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let conditions: SQL | undefined = undefined;

  // Build filter conditions
  if (status) {
    switch (status) {
      case "completed":
        conditions = isNotNull(tasks.completedAt);
        break;
      case "failed":
        conditions = isNotNull(tasks.failedAt);
        break;
      case "in_progress":
        conditions = and(
          isNotNull(tasks.startedAt),
          isNull(tasks.completedAt),
          isNull(tasks.failedAt),
        );
        break;
      case "pending":
        conditions = isNull(tasks.startedAt);
        break;
    }
  }

  // Execute queries with filters
  const allTasks = await db
    .select()
    .from(tasks)
    .where(conditions)
    .orderBy(tasks.id)
    .limit(parseInt(limit))
    .offset(offset);

  const total = await db.$count(tasks, conditions);

  return Response.json(
    {
      tasks: allTasks,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      },
    },
    { headers: corsHeaders },
  );
}

export async function getTaskStats(req: Request) {
  if (!(await authenticateRequest(req))) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }
  const totalCount = await db.$count(tasks);
  const completedCount = await db.$count(tasks, isNotNull(tasks.completedAt));
  const failedCount = await db.$count(tasks, isNotNull(tasks.failedAt));
  const pendingCount = await db.$count(tasks, isNull(tasks.startedAt));
  const inProgressCount = await db.$count(
    tasks,
    and(
      isNotNull(tasks.startedAt),
      isNull(tasks.completedAt),
      isNull(tasks.failedAt),
    ),
  );

  return Response.json(
    {
      total: totalCount,
      completed: completedCount,
      failed: failedCount,
      pending: pendingCount,
      inProgress: inProgressCount,
    },
    { headers: corsHeaders },
  );
}

export async function getTaskById(req: BunRequest<"/api/tasks/:id">) {
  if (!(await authenticateRequest(req))) {
    return new Response("Unauthorized", { status: 401, headers: corsHeaders });
  }
  const taskId = parseInt(req.params.id);
  if (isNaN(taskId)) {
    return new Response("Invalid task ID", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const task = await db.select().from(tasks).where(eq(tasks.id, taskId));
  if (!task.length) {
    return new Response("Task not found", {
      status: 404,
      headers: corsHeaders,
    });
  }

  return Response.json(task[0], { headers: corsHeaders });
}
