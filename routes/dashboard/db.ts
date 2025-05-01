import { db } from "../../db/db";
import { authenticateRequest } from "../../middleware/auth";
import { corsHeaders } from "../../middleware/cors";

export async function executeQuery(request: Request) {
  console.log("Executing query");
  if (!(await authenticateRequest(request))) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders },
    );
  }

  try {
    const body = (await request.json()) as { query: string };

    if (!body.query || typeof body.query !== "string") {
      return Response.json(
        { error: "Query must be a string" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Check if the query has a LIMIT clause
    const hasLimit = /LIMIT\s+\d+/i.test(body.query);
    if (!hasLimit) {
      return Response.json(
        {
          error:
            "Query must include a LIMIT clause to prevent excessive data retrieval",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const result = db.$client.query(body.query).all();

    // Return the results
    return Response.json(result, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Error executing query:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}
