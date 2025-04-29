import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { tasks } from "../db/schema";
import { type TaskType as TaskTypeKey } from "./TaskMap";

export default abstract class Task<
  TaskType extends TaskTypeKey,
  Data extends object,
> {
  id: number;
  type: TaskType;
  data: Data;
  startedAt: Date | null;
  error: string | null;
  failedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: number,
    type: TaskType,
    data: string | null,
    error: string | null,
    startedAt: string | null,
    failedAt: string | null,
    completedAt: string | null,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.type = type;
    this.data = data ? JSON.parse(data) : null;
    this.error = error;
    this.startedAt = startedAt ? new Date(startedAt) : null;
    this.failedAt = failedAt ? new Date(failedAt) : null;
    this.completedAt = completedAt ? new Date(completedAt) : null;
    this.createdAt = new Date(createdAt);
    this.updatedAt = new Date(updatedAt);
  }

  static async create<TaskType extends TaskTypeKey, Data extends object>(
    type: TaskType,
    data: Data,
  ): Promise<void> {
    await db.insert(tasks).values({
      type: type,
      data: JSON.stringify(data),
    });
  }

  abstract handle(): Promise<void>;

  async start() {
    this.startedAt = new Date();
    await this.save();
    try {
      await this.handle();
      this.completedAt = new Date();
      await this.save();
    } catch (e: unknown) {
      this.failedAt = new Date();
      this.error = e instanceof Error ? e.message : String(e);
      await this.save();
    }
  }

  async save() {
    await db
      .update(tasks)
      .set({
        id: this.id,
        type: this.type,
        data: JSON.stringify(this.data),
        error: this.error,
        startedAt: this.startedAt?.toISOString() ?? null,
        failedAt: this.failedAt?.toISOString() ?? null,
        completedAt: this.completedAt?.toISOString() ?? null,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
      })
      .where(eq(tasks.id, this.id))
      .execute();
  }
}
