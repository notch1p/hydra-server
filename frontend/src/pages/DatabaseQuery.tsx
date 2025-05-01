import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

interface QueryResult {
  columns: string[];
  rows: Record<string, object | string | number | boolean | null>[];
}

export function DatabaseQuery() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuery = async () => {
    if (!description.trim()) {
      setError("Please enter a description");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/db/generate-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate query");
      }

      const data = await response.json();
      setQuery(data.query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/db/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to execute query");
      }

      const data = await response.json();

      // If we have results, extract column names from the first row
      if (data.length > 0) {
        const columns = Object.keys(data[0]);
        setResult({
          columns,
          rows: data,
        });
      } else {
        setResult({
          columns: [],
          rows: [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-2xl font-bold">Database Query</h1>
      </div>

      <div className="mb-6">
        <textarea
          className="w-full h-32 p-2 border rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what data you want to retrieve in natural language..."
        />
        <button
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 cursor-pointer"
          onClick={generateQuery}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate SQL Query"}
        </button>
      </div>

      <div className="mb-6">
        <textarea
          className="w-full h-32 p-2 border rounded-md font-mono"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query (must include LIMIT)..."
        />
      </div>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
        onClick={executeQuery}
        disabled={isLoading}
      >
        {isLoading ? "Executing..." : "Execute Query"}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  {result.columns.map((column) => (
                    <th
                      key={column}
                      className="px-4 py-2 border-b text-left font-semibold"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {result.columns.map((column) => (
                      <td
                        key={`${rowIndex}-${column}`}
                        className="px-4 py-2 border-b"
                      >
                        {typeof row[column] === "object"
                          ? JSON.stringify(row[column])
                          : row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
