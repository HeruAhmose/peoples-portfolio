import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PUBLIC_WORLD_URLS } from "./publicWorlds";

const RETIRED_QUEEN_CALIFIA_URL = "https://queencalifia-cyberai.web.app/";

describe("public TRAI world endpoints", () => {
  it("uses absolute HTTPS URLs", () => {
    for (const url of Object.values(PUBLIC_WORLD_URLS)) {
      expect(url).toMatch(/^https:\/\//);
    }
  });

  it("pins Queen Califia to the current Pages command surface", () => {
    expect(PUBLIC_WORLD_URLS.queenCalifia).toBe(
      "https://heruahmose.github.io/QueenCalifia-CyberAI/"
    );
  });

  it("keeps the retired Firebase surface out of public copy and manifests", () => {
    const paths = [
      "README.md",
      "CLAUDE.md",
      "client/public/trai-organism-v5.json",
      "client/src/components/HKAssistant.tsx",
      "shared/hkSystemContext.ts",
    ];

    for (const path of paths) {
      const source = readFileSync(resolve(__dirname, "..", path), "utf8");
      expect(source, path).not.toContain(RETIRED_QUEEN_CALIFIA_URL);
      expect(source, path).not.toContain("queencalifia-cyberai.web.app");
    }
  });
});
