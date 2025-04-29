import { readFileSync } from "fs";
import { join } from "path";
import { corsHeaders } from "../../middleware/cors";

const contentTypes = {
  js: "application/javascript",
  css: "text/css",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  json: "application/json",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
} as const;

export function serveStaticFile(req: Request) {
  const filename = req.url.split("/").pop() || "";
  const filePath = join(process.cwd(), "dist", "assets", filename);

  try {
    const file = readFileSync(filePath);
    const ext = filePath.split(".").pop() || "";
    const contentType =
      contentTypes[ext as keyof typeof contentTypes] || "text/plain";

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        ...corsHeaders,
      },
    });
  } catch (e) {
    console.error("Error serving file:", e);
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  }
}
