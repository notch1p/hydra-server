export async function authenticateRequest(req: Request): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return false;

  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer" || !token) return false;

  return token === process.env.DASHBOARD_PASSWORD;
}
