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

describe("CAREER_MILESTONES data", () => {
  it("stores milestones in ascending year order in the canonical export", () => {
    const years = CAREER_MILESTONES.map(m => m.year);
    expect(years).toEqual([...years].sort((a, b) => a - b));
  });

  it("contains exactly eight milestones", () => {
    expect(CAREER_MILESTONES).toHaveLength(8);
  });

  it("uses unique ids", () => {
    const ids = CAREER_MILESTONES.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("spans 2018 through 2026", () => {
    const { min, max } = timelineYearBounds(CAREER_MILESTONES);
    expect(min).toBe(2018);
    expect(max).toBe(2026);
  });

  it("requires non-empty org and summary on every milestone", () => {
    for (const m of CAREER_MILESTONES) {
      expect(m.org.trim().length).toBeGreaterThan(0);
      expect(m.summary.trim().length).toBeGreaterThan(0);
      expect(m.title.trim().length).toBeGreaterThan(0);
    }
  });

  it("requires at least one achievement badge each", () => {
    for (const m of CAREER_MILESTONES) {
      expect(m.achievements.length).toBeGreaterThanOrEqual(1);
      for (const a of m.achievements) {
        expect(a.label.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("uses only known marker tones", () => {
    for (const m of CAREER_MILESTONES) {
      expect(isValidMarkerTone(m.markerTone)).toBe(true);
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
  it("returns Dynata row", () => {
    const m = getMilestoneById("m2023-dynata");
    expect(m?.org).toBe("Dynata");
  });

  it("returns undefined for unknown id", () => {
    expect(getMilestoneById("nope")).toBeUndefined();
  });

  it("returns 2026 portfolio milestone", () => {
    const m = getMilestoneById("m2026-portfolio");
    expect(m?.year).toBe(2026);
    expect(m?.achievements.length).toBe(4);
  });
});

describe("milestoneHasExpandableDetail", () => {
  it("is true when detail string present", () => {
    const m = getMilestoneById("m2022-relatecare")!;
    expect(milestoneHasExpandableDetail(m)).toBe(true);
  });

  it("is false when detail absent", () => {
    const m = getMilestoneById("m2021-nsp-peak")!;
    expect(m.detail).toBeUndefined();
    expect(milestoneHasExpandableDetail(m)).toBe(false);
  });
});

describe("aggregations", () => {
  it("counts total achievement badges", () => {
    expect(totalAchievementCount(CAREER_MILESTONES)).toBe(24);
  });

  it("counts milestones with expandable bodies", () => {
    expect(countExpandableMilestones(CAREER_MILESTONES)).toBe(7);
  });

  it("uses eight distinct calendar years", () => {
    expect(new Set(CAREER_MILESTONES.map(m => m.year)).size).toBe(8);
  });

  it("places 2022 healthcare after 2020 energy chronologically", () => {
    const s = milestonesSortedChronological(CAREER_MILESTONES);
    expect(s.findIndex(m => m.year === 2022)).toBeGreaterThan(
      s.findIndex(m => m.year === 2020)
    );
  });

  it("uses mYYYY-slug id convention", () => {
    for (const m of CAREER_MILESTONES) {
      expect(m.id).toMatch(/^m\d{4}-[a-z0-9-]+$/);
    }
  });

  it("marks several milestones with highlight ribbons", () => {
    const withH = CAREER_MILESTONES.filter(m => Boolean(m.highlight));
    expect(withH.length).toBeGreaterThanOrEqual(3);
  });

  it("returns empty bounds for empty input", () => {
    const b = timelineYearBounds([]);
    expect(Number.isNaN(b.min)).toBe(true);
    expect(Number.isNaN(b.max)).toBe(true);
  });
});

describe("isValidMarkerTone", () => {
  it("accepts gold", () => {
    expect(isValidMarkerTone("gold")).toBe(true);
  });

  it("rejects random strings", () => {
    expect(isValidMarkerTone("neon")).toBe(false);
  });
});

describe("milestonesSortedChronological", () => {
  it("re-sorts a reversed copy into ascending years", () => {
    const shuffled = [...CAREER_MILESTONES].reverse();
    const s = milestonesSortedChronological(shuffled);
    expect(s[0]!.year).toBe(2018);
    expect(s[s.length - 1]!.year).toBe(2026);
  });
});

describe("coverage hooks", () => {
  it("includes Integrity Energy 2020 milestone", () => {
    expect(
      CAREER_MILESTONES.some(
        m => m.org.includes("Integrity") && m.year === 2020
      )
    ).toBe(true);
  });

  it("includes NPower 2025 milestone", () => {
    expect(CAREER_MILESTONES.some(m => m.org === "NPower")).toBe(true);
  });

  it("uses emerald marker for healthcare pivot", () => {
    const m = getMilestoneById("m2022-relatecare")!;
    expect(m.markerTone).toBe("emerald");
  });

  it("uses terracotta for logistics milestone", () => {
    const m = getMilestoneById("m2019-srt")!;
    expect(m.markerTone).toBe("terracotta");
  });
});
