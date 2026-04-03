import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { invokeClaudeChat } from "./_core/claude";
import { publicProcedure, router } from "./_core/trpc";
import {
  createInquiry,
  logVisitorInteraction,
  upsertNotificationPreferences,
} from "./portfolioService";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(12000),
});

export const hkRouter = router({
  chat: publicProcedure
    .input(
      z.object({
        messages: z.array(chatMessageSchema).min(1).max(40),
      })
    )
    .mutation(async ({ input }) => {
      const text = await invokeClaudeChat({
        messages: input.messages,
        maxTokens: 2048,
      });
      return { reply: text } as const;
    }),
});

export const portfolioRouter = router({
  logEvent: publicProcedure
    .input(
      z.object({
        sessionId: z.string().min(8).max(64),
        eventType: z.enum([
          "section_view",
          "patent_claim_expand",
          "assistant_open",
          "cta_click",
        ]),
        section: z.string().min(1).max(128),
        metadata: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      return logVisitorInteraction({
        sessionId: input.sessionId,
        eventType: input.eventType,
        section: input.section,
        metadata: input.metadata,
      });
    }),

  submitInquiry: publicProcedure
    .input(
      z.object({
        email: z.string().email().max(320),
        subject: z.string().min(1).max(500),
        body: z.string().min(1).max(20000),
      })
    )
    .mutation(async ({ input }) => {
      const result = await createInquiry(input);
      if (!result.ok) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Database is not configured; inquiry was not stored.",
        });
      }
      return { success: true as const };
    }),

  setNotificationPreferences: publicProcedure
    .input(
      z.object({
        visitorKey: z.string().min(8).max(64),
        email: z.string().email().max(320).optional().nullable(),
        notifySectionExplores: z.boolean().optional(),
        notifyInquiries: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await upsertNotificationPreferences(input);
      if (!result.ok) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Database is not configured.",
        });
      }
      return { success: true as const };
    }),
});
