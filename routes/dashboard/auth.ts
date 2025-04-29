import { corsHeaders } from "../../middleware/cors";

export async function verifyApiKey(req: Request) {
  const body = (await req.json()) as { apiKey?: string };
  if (body.apiKey && body.apiKey === process.env.DASHBOARD_PASSWORD) {
    return Response.json(
      { message: "Valid API key" },
      { headers: corsHeaders },
    );
  }
  return new Response("Unauthorized", { status: 401, headers: corsHeaders });
}
