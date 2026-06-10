import { useEffect, useState } from "react";
import { apiRequest } from "../api/http";

export function useApi(path, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const result = await apiRequest(path);
        if (!ignore) setData(result);
      } catch (apiError) {
        if (!ignore) setError(apiError.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [path]);

  return { data, setData, loading, error };
}
