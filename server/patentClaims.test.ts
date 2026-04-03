import { describe, it, expect } from "vitest";
import { PATENT_CLAIMS } from "../shared/patentClaims";

describe("patent claims catalog", () => {
  it("has 25 claims", () => {
    expect(PATENT_CLAIMS).toHaveLength(25);
  });

  it("uses three categories with expected counts", () => {
    const composition = PATENT_CLAIMS.filter(c => c.category === "composition");
    const manufacturing = PATENT_CLAIMS.filter(c => c.category === "manufacturing");
    const device = PATENT_CLAIMS.filter(c => c.category === "device");
    expect(composition).toHaveLength(15);
    expect(manufacturing).toHaveLength(3);
    expect(device).toHaveLength(7);
  });

  it("maps claim types", () => {
    expect(PATENT_CLAIMS.every(c => c.claimType)).toBe(true);
  });
});
