import { readFileSync } from "fs";
import { join } from "path";
import { serveStaticFile } from "./static";
import { verifyApiKey } from "./auth";
import { getTasks, getTaskStats, getTaskById } from "./tasks";
import { executeQuery } from "./db";
import { generateQuery } from "./generateQuery";

const indexHtml = readFileSync(
  join(process.cwd(), "dist", "index.html"),
  "utf-8",
);

export default {
  // Serve static assets
  "/assets/*": {
    GET: serveStaticFile,
  },

  // Serve the frontend
  "/*": {
    GET() {
      return new Response(indexHtml, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    },
  },

  // Dashboard API Routes
  "/api/auth/verify": {
    POST: verifyApiKey,
  },

  "/api/tasks": {
    GET: getTasks,
  },

  "/api/tasks/stats": {
    GET: getTaskStats,
  },

  "/api/tasks/:id": {
    GET: getTaskById,
  },

  "/api/db/query": {
    POST: executeQuery,
  },

  "/api/db/generate-query": {
    POST: generateQuery,
  },
};
