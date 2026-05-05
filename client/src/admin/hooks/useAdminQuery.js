import { useEffect, useState } from "react";

export const useAdminQuery = (fetcher, dependencies = [], initialValue = null) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetcher();
        if (active) {
          setData(result);
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || "Unable to load data");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, dependencies);

  return { data, setData, loading, error };
};
