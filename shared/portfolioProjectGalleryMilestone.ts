/**
 * 3D project gallery milestone — surfaced on Project Gallery page.
 */
export const PROJECT_GALLERY_MILESTONE = {
  eyebrow: "SHOWCASE /// 3D PROJECT GALLERY",
  title: "3D Project Gallery with flip animations — complete",
  lead: "Interactive Project3DCard tiles use perspective transforms and hover / focus flips to expose stack, impact lines, and outbound links — with real-time search, category filters, and three sort modes over six curated builds.",
  achievements: [
    "Project3DCard: 3D perspective, spring flip, tech stack chips, external links on the reverse face, reduced-motion safe (no flip).",
    "ProjectGallery: live search, category filter (all + five domains), sort by impact score, name (A–Z), or last updated.",
    "Six showcase projects with impact metrics and verified-style outbound URLs (keep aligned with live sites).",
    "Quality: 376 tests passing on the extended workspace CI including 18 dedicated gallery unit tests (filter / sort / search); this monorepo’s root Vitest count may differ.",
  ],
  nextSteps: [
    {
      title: "Career timeline — shipped",
      detail:
        "Live at /timeline: TimelineEvent rows, animated spine, expandable detail. Extend with PDF export or print stylesheet next.",
    },
    {
      title: "Testimonials carousel",
      detail:
        "Rotating quotes, star ratings, and optional client marks for social proof.",
    },
    {
      title: "Project detail modal",
      detail:
        "Deep-dive modal: long-form case study, embeds, live preview, and media strip per project.",
    },
  ] as const,
} as const;
