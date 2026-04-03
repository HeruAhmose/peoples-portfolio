import { TRPCError } from "@trpc/server";
import { ENV } from "./env";
import { HK_SYSTEM_CONTEXT } from "@shared/hkSystemContext";

export type ClaudeChatMessage = { role: "user" | "assistant"; content: string };

type AnthropicContentBlock = { type: "text"; text: string };

type AnthropicResponse = {
  content?: AnthropicContentBlock[];
  error?: { message?: string };
};

/**
 * Calls Anthropic Messages API (Claude) with portfolio system context prepended to the system field.
 */
export async function invokeClaudeChat(params: {
  messages: ClaudeChatMessage[];
  maxTokens?: number;
}): Promise<string> {
  const apiKey = ENV.anthropicApiKey?.trim();
  if (!apiKey) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message:
        "Claude API is not configured. Set ANTHROPIC_API_KEY on the server.",
    });
  }

  const { messages, maxTokens = 2048 } = params;
  if (!messages.length) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "At least one message is required.",
    });
  }

  const body = {
    model: ENV.claudeModel,
    max_tokens: maxTokens,
    system: HK_SYSTEM_CONTEXT,
    messages: messages.map(m => ({
      role: m.role,
      content: [{ type: "text", text: m.content }],
    })),
  };

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as AnthropicResponse;

  if (!response.ok) {
    const detail = json?.error?.message ?? "Unknown Anthropic error";
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: `Claude request failed: ${response.status} ${detail}`,
    });
  }

  const text = json.content?.find(b => b.type === "text")?.text?.trim();
  if (!text) {
    throw new TRPCError({
      code: "BAD_GATEWAY",
      message: "Claude returned an empty response.",
    });
  }

  return text;
}
