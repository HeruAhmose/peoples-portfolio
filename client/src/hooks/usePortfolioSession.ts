import { useMemo } from "react";

const SESSION_KEY = "portfolio_session_id";

export function usePortfolioSession(): string {
  return useMemo(() => {
    if (typeof window === "undefined") return "ssr";
    let id = localStorage.getItem(SESSION_KEY);
    if (!id || id.length < 8) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  }, []);
}
