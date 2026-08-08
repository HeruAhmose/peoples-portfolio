export const ABOUT_RESUME_PDF_PATH = "/Jonathan-Peoples-Resume.pdf";

export const aboutContact = {
  location: "North Carolina",
  email: "aitconsult22@gmail.com",
  linkedinHref: "https://www.linkedin.com/in/jonathanpeoples/",
  linkedinLabel: "linkedin.com/in/jonathanpeoples",
  linkedinCertificationsDetailsHref:
    "https://www.linkedin.com/in/jonathanpeoples/details/certifications/",
} as const;

export const aboutHeadline =
  "NAVY VETERAN · FOUNDER · INVENTOR · SYSTEMS BUILDER";

export const aboutSummary =
  "Born in Salisbury and raised in Kannapolis, North Carolina, Jonathan Peoples carries a through-line from football and military service into materials innovation, cybersecurity, and community technology. The portfolio is not a résumé of unrelated jobs; it is a living map of the systems he is building now.";

export const founderOriginFacts = [
  {
    label: "ORIGIN",
    value: "Born in Salisbury, North Carolina",
    detail:
      "The beginning of a North Carolina story shaped by movement, discipline, and building from first principles.",
  },
  {
    label: "ROOTS",
    value: "Raised in Kannapolis",
    detail:
      "Kannapolis became the formative home base for football, community, and the competitive discipline that carries into the work today.",
  },
  {
    label: "FOOTBALL",
    value: "A.L. Brown → Navy football",
    detail:
      "Played football in Kannapolis and was listed by Navy as a 2004 slot-back recruit from Kannapolis, North Carolina.",
  },
  {
    label: "SERVICE",
    value: "U.S. Navy veteran",
    detail:
      "Military service remains part of the operating philosophy: mission focus, accountability, resilience, and service beyond self.",
  },
] as const;

export const founderThesis = [
  "Build new systems instead of accepting fragmented ones as inevitable.",
  "Connect materials, cybersecurity, AI, and community infrastructure rather than treating them as isolated industries.",
  "Keep human agency and transparent governance inside advanced technology.",
  "Translate research into interactive systems people can inspect, challenge, and use.",
] as const;

export const currentWorlds = [
  {
    id: "tamerian",
    title: "Tamerian Materials",
    eyebrow: "MATTER /// ENERGY /// QUANTUM",
    href: "https://tamerian-materials.com/",
    description:
      "Advanced-materials work centered on Tamerian Ore: a hemp-based crystalline composite thesis spanning energy harvesting, quantum sensing, and future information systems.",
    signal: "MATERIALS",
  },
  {
    id: "califia",
    title: "Queen Califia CyberAI",
    eyebrow: "SECURITY /// GOVERNANCE /// AUTONOMY",
    href: "https://queencalifia-cyberai.web.app/",
    description:
      "A sovereign cybersecurity architecture built around unified security engines, biomimetic defense, post-quantum readiness, and human-controlled autonomy.",
    signal: "CYBER",
  },
  {
    id: "techbridge",
    title: "TechBridge Collective",
    eyebrow: "ACCESS /// DIGNITY /// INFRASTRUCTURE",
    href: "https://techbridge-collective.org/",
    description:
      "Community technology infrastructure built around paid Digital Navigators, H.K. AI triage, and measurable service delivery for people navigating the digital world.",
    signal: "COMMUNITY",
  },
  {
    id: "trai",
    title: "TRAI",
    eyebrow: "ORGANISM /// SYSTEMS /// INTEROPERABILITY",
    href: "https://heruahmose.github.io/trai-portfolio/",
    description:
      "The systems world connecting research, interfaces, orchestration, and the shared organism protocol across the portfolio.",
    signal: "SYSTEMS",
  },
] as const;

export const aboutSkillBullets = [
  "Advanced materials · biomimetic systems · energy harvesting · quantum-sensing concepts",
  "Cybersecurity architecture · AI orchestration · post-quantum security · human-controlled autonomy",
  "Interactive systems · React/TypeScript · research UX · 3D/holographic interfaces",
  "Digital equity · community technology infrastructure · service design · measurable impact",
] as const;

export type LinkedInCredential = {
  title: string;
  issuer: string;
  issued: string;
  credentialHref?: string;
};

export const linkedInLicensesAndCertifications: LinkedInCredential[] = [
  {
    title: "IT Security: Defense against the digital dark arts",
    issuer: "United Latino Students Association",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/IDWYDI4PTAS8",
  },
  {
    title: "System Administration and IT Infrastructure Services",
    issuer: "Google",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/CL0ID3V0Z82C",
  },
  {
    title: "Google IT Support Professional Certificate (v2)",
    issuer: "Coursera",
    issued: "Mar 2025",
    credentialHref:
      "https://www.credly.com/badges/a4e76a58-9cc9-4d03-9167-64db2475778a",
  },
] as const;

export const aboutCertificationsResumeSupplement =
  "Additional training spans cybersecurity, IT support, project management, UX, cloud technologies, data, automation, and AI.";

export type AboutRole = {
  title: string;
  org: string;
  location?: string;
  period: string;
  bullets: string[];
};

/**
 * Compatibility exports intentionally remain empty.
 * The public portfolio no longer presents unrelated employment history.
 */
export const aboutExperiencePrimary: AboutRole[] = [];
export const aboutExperienceAdditional: string[] = [];

export const aboutEducation = [
  "United States Naval Academy — engineering coursework",
  "SUNY Maritime — international business coursework",
  "NPower — technology and cybersecurity training",
] as const;

export const aboutHonors =
  "U.S. Navy veteran · football background · founder and builder across materials, cybersecurity, and community technology";
