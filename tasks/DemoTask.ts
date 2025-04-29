import Task from "./Task";

type DemoTaskData = {
  message: string;
};

export default class DemoTask extends Task<"DemoTask", DemoTaskData> {
  async handle(): Promise<void> {
    await new Promise<void>((resolve) =>
      setTimeout(resolve, Math.random() * 1000),
    );
    if (Math.random() < 0.2) {
      console.log("Failed");
      throw new Error("Random error");
    }
    console.log("Demo Task:", this.data.message);
  }
}
