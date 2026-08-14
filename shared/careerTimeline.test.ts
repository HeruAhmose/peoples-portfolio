import { describe, expect, it } from "vitest";
import {
  CAREER_MILESTONES,
  MARKER_TONE_CSS_VAR,
  TIMELINE_MARKER_TONES,
  countExpandableMilestones,
  getMilestoneById,
  isValidMarkerTone,
  milestoneHasExpandableDetail,
  milestonesSortedChronological,
  timelineYearBounds,
  totalAchievementCount,
} from "./careerTimeline";

describe("CAREER_MILESTONES founder journey", () => {
  it("stores milestones in ascending year order", () => {
    const years = CAREER_MILESTONES.map(milestone => milestone.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("contains six founder-journey milestones", () => {
    expect(CAREER_MILESTONES).toHaveLength(6);
  });

  it("uses unique ids", () => {
    const ids = CAREER_MILESTONES.map(milestone => milestone.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("spans 2004 through 2026", () => {
    const { min, max } = timelineYearBounds(CAREER_MILESTONES);

    expect(min).toBe(2004);
    expect(max).toBe(2026);
  });

  it("requires non-empty organization, title, and summary", () => {
    for (const milestone of CAREER_MILESTONES) {
      expect(milestone.org.trim().length).toBeGreaterThan(0);
      expect(milestone.title.trim().length).toBeGreaterThan(0);
      expect(milestone.summary.trim().length).toBeGreaterThan(0);
    }
  });

  it("requires at least one achievement badge each", () => {
    for (const milestone of CAREER_MILESTONES) {
      expect(milestone.achievements.length).toBeGreaterThanOrEqual(1);

      for (const achievement of milestone.achievements) {
        expect(achievement.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("uses only known marker tones", () => {
    for (const milestone of CAREER_MILESTONES) {
      expect(isValidMarkerTone(milestone.markerTone)).toBe(true);
    }
  });

  it("maps every tone to a CSS variable key", () => {
    expect(Object.keys(MARKER_TONE_CSS_VAR).length).toBe(
      TIMELINE_MARKER_TONES.length
    );

    for (const tone of TIMELINE_MARKER_TONES) {
      expect(MARKER_TONE_CSS_VAR[tone]).toMatch(/^--/);
    }
  });
});

describe("getMilestoneById", () => {
  it("returns the Navy football/service milestone", () => {
    const milestone = getMilestoneById("m2004-navy-football");

    expect(milestone?.year).toBe(2004);
    expect(milestone?.org).toContain("Navy");
  });

  it("returns the Tamerian Ore milestone", () => {
    const milestone = getMilestoneById("m2025-tamerian-ore");

    expect(milestone?.year).toBe(2025);
    expect(milestone?.title).toBe("Tamerian Ore");
  });

  it("returns the connected organism milestone", () => {
    const milestone = getMilestoneById("m2026-organism");

    expect(milestone?.year).toBe(2026);
    expect(milestone?.achievements.length).toBe(4);
  });

  it("returns undefined for an unknown id", () => {
    expect(getMilestoneById("nope")).toBeUndefined();
  });
});

describe("milestone detail helpers", () => {
  it("recognizes expandable founder milestones", () => {
    const milestone = getMilestoneById("m2026-techbridge")!;
    expect(milestoneHasExpandableDetail(milestone)).toBe(true);
  });

  it("all current founder milestones include detail", () => {
    expect(countExpandableMilestones(CAREER_MILESTONES)).toBe(6);
  });
});

describe("aggregations", () => {
  it("counts founder-journey achievement badges", () => {
    expect(totalAchievementCount(CAREER_MILESTONES)).toBe(22);
  });

  it("uses four distinct calendar years", () => {
    expect(
      new Set(CAREER_MILESTONES.map(milestone => milestone.year)).size
    ).toBe(4);
  });

  it("keeps service before the materials chapter", () => {
    const sorted = milestonesSortedChronological(CAREER_MILESTONES);

    expect(
      sorted.findIndex(milestone => milestone.id === "m2004-navy-football")
    ).toBeLessThan(
      sorted.findIndex(milestone => milestone.id === "m2025-tamerian-ore")
    );
  });

  it("uses the mYYYY-slug id convention", () => {
    for (const milestone of CAREER_MILESTONES) {
      expect(milestone.id).toMatch(/^m\d{4}-[a-z0-9-]+$/);
    }
  });

  it("marks several milestones with highlight ribbons", () => {
    const highlighted = CAREER_MILESTONES.filter(milestone =>
      Boolean(milestone.highlight)
    );

    expect(highlighted.length).toBeGreaterThanOrEqual(3);
  });

  it("returns empty bounds for empty input", () => {
    const bounds = timelineYearBounds([]);

    expect(Number.isNaN(bounds.min)).toBe(true);
    expect(Number.isNaN(bounds.max)).toBe(true);
  });
});

describe("founder-world coverage", () => {
  it("includes Tamerian, Queen Califia, TechBridge, and the organism", () => {
    const ids = new Set(CAREER_MILESTONES.map(milestone => milestone.id));

    expect(ids.has("m2025-tamerian-ore")).toBe(true);
    expect(ids.has("m2026-queen-califia")).toBe(true);
    expect(ids.has("m2026-techbridge")).toBe(true);
    expect(ids.has("m2026-organism")).toBe(true);
  });

  it("accepts gold and rejects unknown marker tones", () => {
    expect(isValidMarkerTone("gold")).toBe(true);
    expect(isValidMarkerTone("neon")).toBe(false);
  });

  it("re-sorts a reversed copy chronologically", () => {
    const reversed = [...CAREER_MILESTONES].reverse();
    const sorted = milestonesSortedChronological(reversed);

    expect(sorted[0]!.year).toBe(2004);
    expect(sorted[sorted.length - 1]!.year).toBe(2026);
  });
});
