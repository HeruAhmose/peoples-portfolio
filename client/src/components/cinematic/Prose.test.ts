import { describe, expect, it } from "vitest";
import { SAFE_URL } from "./Prose";

describe("Prose assistant-link security contract", () => {
  it("allows the schemes and local references used by assistant content", () => {
    for (const url of [
      "https://example.com/reference",
      "http://localhost:3000/path",
      "mailto:hello@example.com",
      "tel:+15551234567",
      "/portfolio",
      "./relative",
      "#section",
    ]) {
      expect(SAFE_URL.test(url)).toBe(true);
    }
  });

  it("rejects executable and embedded-data link schemes", () => {
    for (const url of [
      "javascript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
      "file:///etc/passwd",
    ]) {
      expect(SAFE_URL.test(url)).toBe(false);
    }
  });
});
