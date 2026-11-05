import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

export function useApi(path) {
  const [tick, setTick] = useState(0);
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });
  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    if (!path) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => { alive = false; };
  }, [path, tick]);

  return { ...state, reload };
}
