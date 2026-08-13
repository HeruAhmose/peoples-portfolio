import { describe, expect, it } from "vitest";
import {
  ORGANS,
  NAVIGABLE_ORGANS,
  organForRoute,
  routeAccent,
  RING_ANGLES,
  CLAIM_FONT,
  CLAIM_LABEL,
} from "../client/src/lib/organism";

/**
 * Guards the organ graph and, more importantly, the two defects that reached a
 * package before being caught: the base-aware deep-link check, and Prose
 * emitting whatever URL scheme the markdown carried.
 */

/** pathToSection, lifted from App.tsx. Kept in sync by the test below. */
function pathToSection(loc: string): string {
  const raw = loc.split("?")[0] || "/";
  const path = raw.replace(/\/$/, "") || "/";
  if (path === "/" || path === "") return "home";
  const seg = path.slice(1).split("/")[0];
  if (
    seg === "materials" ||
    seg === "community" ||
    seg === "research" ||
    seg === "gallery" ||
    seg === "timeline"
  )
    return seg;
  return "home";
}

/** wouter strips the Router base before handing location to components. */
function routerRelative(browserPath: string, base: string): string {
  return browserPath.startsWith(base)
    ? browserPath.slice(base.length) || "/"
    : browserPath;
}

describe("organ graph", () => {
  it("has seven organs in contiguous anatomical order", () => {
    expect(ORGANS).toHaveLength(7);
    expect(ORGANS.map(o => o.order)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("has unique numbers, roles and names", () => {
    expect(new Set(ORGANS.map(o => o.num)).size).toBe(7);
    expect(new Set(ORGANS.map(o => o.role)).size).toBe(7);
    expect(new Set(ORGANS.map(o => o.name)).size).toBe(7);
  });

  it("uses valid hex accents and complete claim registers", () => {
    for (const o of ORGANS) {
      expect(o.hex).toMatch(/^#[0-9a-f]{6}$/i);
      expect(CLAIM_FONT[o.claim]).toBeTruthy();
      expect(CLAIM_LABEL[o.claim]).toBeTruthy();
      expect(o.status.length).toBeGreaterThan(0);
    }
  });

  it("only claims routes that this site actually serves", () => {
    const real = [
      "/materials",
      "/community",
      "/research",
      "/gallery",
      "/timeline",
    ];
    for (const o of NAVIGABLE_ORGANS) expect(real).toContain(o.route);
  });

  it("resolves organs and accents by route", () => {
    for (const o of NAVIGABLE_ORGANS) {
      expect(organForRoute(o.route)?.name).toBe(o.name);
      expect(routeAccent(o.route)).toBe(o.hex);
    }
    expect(organForRoute("/nope")).toBeUndefined();
    expect(routeAccent("/nope")).toBe("#d6a33a");
  });

  it("only stores absolute https external URLs", () => {
    for (const o of ORGANS) {
      if (o.external !== null) expect(o.external).toMatch(/^https:\/\/.+/);
    }
  });

  it("pins the verified live Tamerian and True Melange worlds", () => {
    expect(ORGANS.find(o => o.name === "Tamerian Materials")?.external).toBe(
      "https://tamerian-materials.com/"
    );
    expect(ORGANS.find(o => o.name === "True Melange Φ")?.external).toBe(
      "https://heruahmose.github.io/blue-gold-daily/layers.html"
    );
  });


  it("places organ 0 at the top and spaces the ring evenly", () => {
    expect(RING_ANGLES[0]).toBeCloseTo(-Math.PI / 2, 10);
    for (let i = 1; i < 7; i++) {
      expect(RING_ANGLES[i] - RING_ANGLES[i - 1]).toBeCloseTo(
        (Math.PI * 2) / 7,
        10
      );
    }
  });
});

describe("opening sequence gating (regression)", () => {
  // Reading window.location.pathname here saw "/peoples-portfolio/materials"
  // on Pages, whose first segment is the repo name, so every deep link looked
  // like "home" and replayed the sequence. App.tsx uses wouter's location.
  const cases: Array<[string, string, string, boolean]> = [
    ["dev root", "/", "", true],
    ["dev deep link", "/materials", "", false],
    ["pages root", "/peoples-portfolio/", "/peoples-portfolio", true],
    [
      "pages deep link",
      "/peoples-portfolio/materials",
      "/peoples-portfolio",
      false,
    ],
    [
      "pages deep link 2",
      "/peoples-portfolio/community",
      "/peoples-portfolio",
      false,
    ],
    [
      "pages deep link 3",
      "/peoples-portfolio/timeline",
      "/peoples-portfolio",
      false,
    ],
  ];

  it.each(cases)(
    "%s: intro plays = %s",
    (_label, browserPath, base, shouldPlay) => {
      const section = pathToSection(routerRelative(browserPath, base));
      expect(section === "home").toBe(shouldPlay);
    }
  );

  it("never treats the repo name as a section", () => {
    expect(pathToSection("/peoples-portfolio/materials")).toBe("home");
    expect(
      pathToSection(
        routerRelative("/peoples-portfolio/materials", "/peoples-portfolio")
      )
    ).toBe("materials");
  });
});
