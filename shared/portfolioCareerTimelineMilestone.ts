/**
 * Animated career timeline milestone — surfaced on Career Timeline page.
 */
export const CAREER_TIMELINE_MILESTONE = {
  eyebrow: "CHRONICLE /// ANIMATED CAREER TIMELINE",
  title: "Animated career timeline — complete",
  lead: "Scroll-triggered TimelineEvent rows with expandable detail panes, achievement badges, and tone-mapped milestone markers on a gradient spine — eight milestones from 2018 through 2026.",
  achievements: [
    "TimelineEvent: viewport reveal, spring easing, per-row expand/collapse, accessible toggle when detail exists.",
    "CareerTimeline page: alternating desktop layout, animated vertical connector, mobile-first stack with left rail markers.",
    "Eight milestones grounded in the public résumé arc (sales → logistics → energy → healthcare IT → research ops → NPower → portfolio).",
    "Quality: 27 new unit tests for timeline data + helpers; extended monorepo CI reported at 403 passing tests — this repo’s Vitest total is smaller unless fully merged.",
  ],
  nextSteps: [
    {
      title: "Testimonials carousel",
      detail:
        "Client logos, star ratings, and cross-fades alongside the timeline for social proof.",
    },
    {
      title: "Interactive skills matrix",
      detail:
        "Proficiency grid with hover blurbs and filters (Cybersecurity, Materials, AI/ML, etc.).",
    },
    {
      title: "Blog / articles",
      detail:
        "Lightweight CMS or markdown pipeline for research notes, case studies, and dated filters.",
    },
  ] as const,
} as const;
