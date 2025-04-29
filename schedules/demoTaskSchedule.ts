import Task from "../tasks/Task";

export default async function demoTaskSchedule() {
  setInterval(() => {
    Task.create("DemoTask", { message: "Hello, world!" });
  }, 500);
}
