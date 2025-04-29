import DemoTask from "./DemoTask";
import CheckForMessages from "./CheckForMessages";

export const TASK_MAP = {
  DemoTask: DemoTask,
  CheckForMessages: CheckForMessages,
};

export type TaskType = keyof typeof TASK_MAP;
