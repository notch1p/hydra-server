import { isNull, and, eq, not } from "drizzle-orm";
import { db } from "../db/db";
import { tasks, type TaskRow } from "../db/schema";
import { TASK_MAP } from "../tasks/TaskMap";

export default class WorkHandler {
  pendingTasks: TaskRow[] = [];

  static async start(): Promise<WorkHandler> {
    const handler = new WorkHandler();
    await handler.cleanUpIncompleteTasksBeforeStarting();
    handler.startCheckingForWork();
    for (let i = 0; i < 10; i++) {
      handler.workTasks();
    }
    return handler;
  }

  async cleanUpIncompleteTasksBeforeStarting() {
    // Find all tasks that have startedAt but no completedAt or failedAt
    const partiallyCompletedTasks = await db
      .select()
      .from(tasks)
      .where(
        and(
          not(isNull(tasks.startedAt)),
          isNull(tasks.completedAt),
          isNull(tasks.failedAt),
        ),
      )
      .execute();

    // Mark all partially completed tasks as failed
    for (const task of partiallyCompletedTasks) {
      console.log(`Marking task ${task.id} as failed due to server restart`);
      await db
        .update(tasks)
        .set({
          failedAt: new Date().toISOString(),
          error: "Task was interrupted due to server restart",
        })
        .where(eq(tasks.id, task.id))
        .execute();
    }
  }

  async fetchTasks() {
    const taskRowBatch = await db
      .select()
      .from(tasks)
      .where(isNull(tasks.startedAt))
      .limit(10)
      .execute();

    this.pendingTasks.push(...taskRowBatch);
  }

  async startCheckingForWork() {
    setInterval(async () => {
      if (this.pendingTasks.length === 0) {
        await this.fetchTasks();
      }
    }, 1_000);
  }

  async workTasks() {
    while (true) {
      const taskRow = this.pendingTasks.shift();
      if (taskRow) {
        const TaskClass = TASK_MAP[taskRow.type];
        if (TaskClass) {
          const task = new TaskClass(
            taskRow.id,
            taskRow.type as unknown as never,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            taskRow.data as any,
            taskRow.error,
            taskRow.startedAt,
            taskRow.failedAt,
            taskRow.completedAt,
            taskRow.createdAt,
            taskRow.updatedAt,
          );
          await task.start();
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
      }
    }
  }
}
