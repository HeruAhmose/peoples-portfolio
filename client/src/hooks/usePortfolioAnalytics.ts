import { useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { usePortfolioSession } from "./usePortfolioSession";

export function usePortfolioAnalytics() {
  const sessionId = usePortfolioSession();
  const { mutate } = trpc.portfolio.logEvent.useMutation();

  const logSectionView = useCallback(
    (section: string) => {
      mutate({ sessionId, eventType: "section_view", section });
    },
    [mutate, sessionId]
  );

  const logPatentClaimExpand = useCallback(
    (claimNumber: number) => {
      mutate({
        sessionId,
        eventType: "patent_claim_expand",
        section: "materials_patents",
        metadata: { claimNumber },
      });
    },
    [mutate, sessionId]
  );

  const logAssistantOpen = useCallback(() => {
    mutate({
      sessionId,
      eventType: "assistant_open",
      section: "hk_assistant",
    });
  }, [mutate, sessionId]);

  return { sessionId, logSectionView, logPatentClaimExpand, logAssistantOpen };
}
