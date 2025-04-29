import WorkHandler from "../services/WorkHandler";
import cleanupFinishedTasks from "./cleanupFinishedTasks";
import checkForMessagesSchedule from "./checkForMessagesSchedule";
import checkSubscriptionStatus from "./checkSubscriptionStatus";

export default function startSchedules() {
  // demoTaskSchedule();
  checkForMessagesSchedule();
  checkSubscriptionStatus();
  cleanupFinishedTasks();
  WorkHandler.start();
}
