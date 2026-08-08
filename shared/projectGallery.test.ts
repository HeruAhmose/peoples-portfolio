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
  it("exports exactly six founder-world projects", () => {
    expect(SHOWCASE_PROJECTS).toHaveLength(6);
  });

  it("uses unique ids for every project", () => {
    const ids = SHOWCASE_PROJECTS.map(project => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("contains the four connected founder systems", () => {
    const ids = new Set(SHOWCASE_PROJECTS.map(project => project.id));

    expect(ids.has("tamerian-materials")).toBe(true);
    expect(ids.has("queen-califia")).toBe(true);
    expect(ids.has("techbridge")).toBe(true);
    expect(ids.has("trai-organism")).toBe(true);
  });

  it("requires core fields on every project", () => {
    for (const project of SHOWCASE_PROJECTS) {
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(project.shortDescription.trim().length).toBeGreaterThan(0);
      expect(project.techStack.length).toBeGreaterThan(0);
      expect(project.links.length).toBeGreaterThan(0);
      expect(project.impactScore).toBeGreaterThanOrEqual(0);
      expect(project.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
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
    const project = SHOWCASE_PROJECTS[0]!;
    expect(projectMatchesSearch(project, "")).toBe(true);
    expect(projectMatchesSearch(project, "   ")).toBe(true);
  });

  it("matches title substring case-insensitively", () => {
    const project = SHOWCASE_PROJECTS.find(
      item => item.id === "tamerian-materials"
    )!;

    expect(projectMatchesSearch(project, "tamer")).toBe(true);
    expect(projectMatchesSearch(project, "TAMER")).toBe(true);
  });

  it("matches technology tokens", () => {
    const project = SHOWCASE_PROJECTS.find(
      item => item.id === "queen-califia"
    )!;

    expect(projectMatchesSearch(project, "firebase")).toBe(true);
  });

  it("returns false when no field contains the query", () => {
    const project = SHOWCASE_PROJECTS[0]!;
    expect(projectMatchesSearch(project, "zzzznonexistent")).toBe(false);
  });
});

describe("filterProjectsByCategory", () => {
  it("returns all projects for category all", () => {
    expect(filterProjectsByCategory(SHOWCASE_PROJECTS, "all")).toHaveLength(6);
  });

  it("filters to cybersecurity only", () => {
    const list = filterProjectsByCategory(
      SHOWCASE_PROJECTS,
      "cybersecurity"
    );

    expect(list).toHaveLength(1);
    expect(list[0]!.id).toBe("queen-califia");
  });

  it("filters platform work to TRAI and NPower", () => {
    const list = filterProjectsByCategory(SHOWCASE_PROJECTS, "platform");

    expect(list.map(project => project.id).sort()).toEqual(
      ["npower-path", "trai-organism"].sort()
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
    const titles = sorted.map(project => project.title);
    const expected = [...titles].sort((a, b) => a.localeCompare(b, "en"));

    expect(titles).toEqual(expected);
  });

  it("sorts by updatedAt descending for recent", () => {
    const sorted = sortShowcaseProjects(SHOWCASE_PROJECTS, "recent");
    const first = new Date(sorted[0]!.updatedAt).getTime();
    const second = new Date(sorted[1]!.updatedAt).getTime();

    expect(first).toBeGreaterThanOrEqual(second);
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

  it("narrows platform category then sorts by name", () => {
    const result = queryShowcaseProjects(SHOWCASE_PROJECTS, {
      search: "",
      category: "platform",
      sort: "name",
    });

    expect(result.map(project => project.title)).toEqual([
      "NPower Technology & Cybersecurity Training",
      "TRAI",
    ]);
  });

  it("isolates materials science", () => {
    const result = queryShowcaseProjects(SHOWCASE_PROJECTS, {
      search: "",
      category: "materials",
      sort: "recent",
    });

    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("tamerian-materials");
  });
});
