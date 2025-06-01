import { serve } from "bun";
import "./db/migrate";
import startSchedules from "./schedules/startSchedules";
import dashboardRoutes from "./routes/dashboard/index";
import { corsPreflight } from "./middleware/cors";
import notificationsRoutes from "./routes/notifications/index";
import customersRoutes from "./routes/customers/index";
import aiRoutes from "./routes/ai/index";

startSchedules();

const server = serve({
  port: process.env.PORT ?? 3000,
  development: true,
  routes: {
    // Handle CORS preflight for API routes
    "/api/*": {
      OPTIONS: corsPreflight,
    },
    "/api/status": {
      GET: () => new Response("Hydra server is up", { status: 200 }),
    },

    ...dashboardRoutes,
    ...customersRoutes,
    ...notificationsRoutes,
    ...aiRoutes,
  },
});

console.log(`Server running at ${server.url}`);
