import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Prose renders assistant output. Escaping HTML is not enough on its own:
 * `[x](javascript:...)` would otherwise become a live href. This reads the
 * allowlist out of the component so the test cannot drift from what ships.
 */

const SOURCE = resolve(
  __dirname,
  "../client/src/components/cinematic/Prose.tsx"
);

function safeUrlPattern(): RegExp {
  const src = readFileSync(SOURCE, "utf8");
  const m = src.match(/const SAFE_URL = (\/.+\/i);/);
  if (!m) throw new Error("SAFE_URL not found in Prose.tsx");
  // eslint-disable-next-line no-eval
  return eval(m[1]) as RegExp;
}

describe("Prose URL allowlist", () => {
  const SAFE_URL = safeUrlPattern();

  const blocked = [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "  javascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
  ];
  const allowed = [
    "https://tamerian-materials.com/",
    "http://example.com",
    "mailto:aitconsult22@gmail.com",
    "tel:+12163070174",
    "/materials",
    "./gallery",
    "#claims",
  ];

  it.each(blocked)("blocks %s", url => {
    expect(SAFE_URL.test(url.trim())).toBe(false);
  });

  it.each(allowed)("allows %s", url => {
    expect(SAFE_URL.test(url.trim())).toBe(true);
  });

  it("the component actually applies the allowlist", () => {
    const src = readFileSync(SOURCE, "utf8");
    expect(src).toMatch(/SAFE_URL\.test\(raw\)\s*\?\s*raw\s*:\s*"#"/);
    // The comment in Prose.tsx mentions dangerouslySetInnerHTML to explain that
    // it is deliberately not used, so assert on usage rather than the word.
    expect(src).not.toMatch(/dangerouslySetInnerHTML\s*=/);
  });
});
