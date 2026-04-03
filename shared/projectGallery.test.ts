import { describe, expect, it } from "vitest";
import {
  filterProjectsByCategory,
  normalizeSearchQuery,
  projectMatchesSearch,
  queryShowcaseProjects,
  SHOWCASE_PROJECTS,
  sortShowcaseProjects,
} from "./projectGallery";

describe("projectGallery data", () => {
  it("exports exactly six showcase projects", () => {
    expect(SHOWCASE_PROJECTS).toHaveLength(6);
  });

  it("uses unique ids for every project", () => {
    const ids = SHOWCASE_PROJECTS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires core fields on each project", () => {
    for (const p of SHOWCASE_PROJECTS) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.shortDescription.length).toBeGreaterThan(0);
      expect(p.techStack.length).toBeGreaterThan(0);
      expect(p.links.length).toBeGreaterThan(0);
      expect(p.impactScore).toBeGreaterThanOrEqual(0);
      expect(p.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("normalizeSearchQuery", () => {
  it("trims and lowercases", () => {
    expect(normalizeSearchQuery("  FireBase  ")).toBe("firebase");
  });
});

describe("projectMatchesSearch", () => {
  it("matches all when query empty", () => {
    const p = SHOWCASE_PROJECTS[0]!;
    expect(projectMatchesSearch(p, "")).toBe(true);
    expect(projectMatchesSearch(p, "   ")).toBe(true);
  });

  it("matches title substring case-insensitively", () => {
    const p = SHOWCASE_PROJECTS.find(x => x.id === "tamerian-materials")!;
    expect(projectMatchesSearch(p, "tamer")).toBe(true);
    expect(projectMatchesSearch(p, "TAMER")).toBe(true);
  });

  it("matches tech stack tokens", () => {
    const p = SHOWCASE_PROJECTS.find(x => x.id === "queen-califia")!;
    expect(projectMatchesSearch(p, "firebase")).toBe(true);
  });

  it("returns false when no field contains query", () => {
    const p = SHOWCASE_PROJECTS[0]!;
    expect(projectMatchesSearch(p, "zzzznonexistent")).toBe(false);
  });
});

describe("filterProjectsByCategory", () => {
  it("returns all projects for category all", () => {
    expect(filterProjectsByCategory(SHOWCASE_PROJECTS, "all")).toHaveLength(6);
  });

  it("filters to cybersecurity only", () => {
    const list = filterProjectsByCategory(SHOWCASE_PROJECTS, "cybersecurity");
    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe("queen-califia");
  });

  it("filters platform projects", () => {
    const list = filterProjectsByCategory(SHOWCASE_PROJECTS, "platform");
    expect(list.map(p => p.id).sort()).toEqual(
      ["dynata-ops", "npower-path"].sort()
    );
  });
});

describe("sortShowcaseProjects", () => {
  it("sorts by impact descending", () => {
    const sorted = sortShowcaseProjects(SHOWCASE_PROJECTS, "impact");
    expect(sorted[0]!.impactScore).toBeGreaterThanOrEqual(
      sorted[1]!.impactScore
    );
    expect(sorted[0]!.id).toBe("tamerian-materials");
  });

  it("sorts by title ascending", () => {
    const sorted = sortShowcaseProjects(SHOWCASE_PROJECTS, "name");
    const titles = sorted.map(p => p.title);
    const expected = [...titles].sort((a, b) => a.localeCompare(b, "en"));
    expect(titles).toEqual(expected);
  });

  it("sorts by updatedAt descending for recent", () => {
    const sorted = sortShowcaseProjects(SHOWCASE_PROJECTS, "recent");
    const t0 = new Date(sorted[0]!.updatedAt).getTime();
    const t1 = new Date(sorted[1]!.updatedAt).getTime();
    expect(t0).toBeGreaterThanOrEqual(t1);
  });
});

describe("queryShowcaseProjects", () => {
  it("applies filter, search, and sort together", () => {
    const result = queryShowcaseProjects(SHOWCASE_PROJECTS, {
      search: "tech",
      category: "equity",
      sort: "impact",
    });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("techbridge");
  });

  it("returns empty when search matches nothing", () => {
    const result = queryShowcaseProjects(SHOWCASE_PROJECTS, {
      search: "noSuchToken12345",
      category: "all",
      sort: "name",
    });
    expect(result).toHaveLength(0);
  });

  it("narrows category then sorts by name", () => {
    const result = queryShowcaseProjects(SHOWCASE_PROJECTS, {
      search: "",
      category: "platform",
      sort: "name",
    });
    expect(result.map(p => p.title)).toEqual([
      "Dynata Research Operations",
      "NPower Tech Fundamentals",
    ]);
  });

  it("isolates materials science row", () => {
    const result = queryShowcaseProjects(SHOWCASE_PROJECTS, {
      search: "",
      category: "materials",
      sort: "recent",
    });
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("tamerian-materials");
  });
});
