/**
 * About / résumé copy sourced from the author’s PDF résumé (keep in sync if the PDF updates).
 * Public file: client/public/Jonathan-Peoples-Resume.pdf
 */
export const ABOUT_RESUME_PDF_PATH = "/Jonathan-Peoples-Resume.pdf";

export const aboutContact = {
  location: "Concord, NC",
  phone: "(216) 307-0174",
  email: "aitconsult22@gmail.com",
  linkedinHref:
    "https://www.linkedin.com/in/jonathanpeoples/?skipRedirect=true",
  linkedinLabel: "linkedin.com/in/jonathanpeoples",
  /** Full licenses & certifications list on LinkedIn (canonical). */
  linkedinCertificationsDetailsHref:
    "https://www.linkedin.com/in/jonathanpeoples/details/certifications/",
} as const;

export const aboutHeadline =
  "IT SUPPORT · SYSTEMS TROUBLESHOOTING · USER EXPERIENCE";

export const aboutSummary =
  "Certified IT Support Specialist and U.S. Navy Veteran with 8+ years of hands-on experience solving technical problems and supporting end users in fast-paced, hybrid, and remote environments. Proven ability to resolve tickets, streamline systems, and improve productivity using tools like Active Directory, Office 365, VPN, Salesforce, and Epic. Backed by 15+ certifications in IT support, cybersecurity, UX, and cloud technologies.";

export const aboutSkillBullets = [
  "Active Directory · Windows/macOS/Linux · VPN · Office 365 · Python scripting",
  "Salesforce · Epic support · Google Workspace · LAN/WAN · cybersecurity fundamentals",
  "Process automation · remote support · workflow optimization · customer service",
] as const;

/**
 * Complete licenses & certifications list — matches LinkedIn profile details:
 * linkedin.com/in/jonathanpeoples/details/certifications/
 */
export type LinkedInCredential = {
  title: string;
  issuer: string;
  issued: string;
  /** Coursera / Credly “view certificate” target (no LinkedIn tracking params). */
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
    title: "Capstone: Applying Project Management in the Real World",
    issuer: "Google",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/IY3DXRKOKU9F",
  },
  {
    title: "Foundations of Project Management",
    issuer: "Google",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/6GAULJHAJRJ3",
  },
  {
    title: "Google IT Support Professional Certificate (v2)",
    issuer: "Coursera",
    issued: "Mar 2025",
    credentialHref:
      "https://www.credly.com/badges/a4e76a58-9cc9-4d03-9167-64db2475778a",
  },
  {
    title: "Google IT Support Specialization",
    issuer: "United Latino Students Association",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/specialization/4ACN9Z5JHX7Q",
  },
  {
    title: "Introduction to Project Management with ClickUp",
    issuer: "Coursera Project Network",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/1X8Z47DXPZZ9",
  },
  {
    title: "Operating Systems and You: Becoming a Power User",
    issuer: "Google",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/H72RMZUGWVJ4",
  },
  {
    title: "Project Execution: Running the Project",
    issuer: "United Latino Students Association",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/NK2BSOS1SDJQ",
  },
  {
    title: "Project Planning: Putting It All Together",
    issuer: "Google",
    issued: "Mar 2025",
    credentialHref:
      "https://www.coursera.org/account/accomplishments/records/FGQ203CV22I8",
  },
];

/** Training and credentials called out on the PDF résumé beyond the LinkedIn certifications list. */
export const aboutCertificationsResumeSupplement =
  "CompTIA A+ · CompTIA Tech+ · Additional Google Career Certificate topics (Data Analytics, Cybersecurity, UX Design, Python Automation, AI Essentials, Agile, Business Intelligence) · Adobe (Graphic Design, Marketing, Content Creation) · CourseCareers: Sales Development Rep, Sales Engineer.";

export type AboutRole = {
  title: string;
  org: string;
  location?: string;
  period: string;
  bullets: string[];
};

export const aboutExperiencePrimary: AboutRole[] = [
  {
    title: "Market Research Interviewer",
    org: "Dynata",
    location: "Remote",
    period: "2023–Present",
    bullets: [
      "Conducted 500+ technical surveys using predictive dialers; 98% accuracy and improved engagement via refined call procedures.",
      "Configured VPN/proxy for secure access to company database.",
    ],
  },
  {
    title: "IT Support & Patient Services",
    org: "RelateCare",
    location: "Remote",
    period: "2022–2023",
    bullets: [
      "Supported 10,000+ Epic users with a 95% satisfaction rate.",
      "Resolved 90% of calls on first contact; reduced average ticket time by 25%.",
    ],
  },
  {
    title: "Sales Manager / Tech Specialist",
    org: "National Sales Partners",
    location: "OH",
    period: "2016–2022",
    bullets: [
      "Led a 15-person team; integrated Salesforce CRM, boosting productivity by 40%.",
      "Delivered $1M+ in revenue; improved issue resolution by 20%.",
    ],
  },
];

export const aboutExperienceAdditional: string[] = [
  "Energy Broker, Integrity (2020–2022): negotiated $500K+ contracts; reduced client costs by 20%.",
  "Truck Driver, SRT (2019–2021): 1,200+ safe deliveries with 0 spoilage.",
  "Midshipman, U.S. Navy (2004–2006): technical support in secure environments during Operation Enduring Freedom.",
];

export const aboutEducation = [
  "SUNY Maritime — International Business coursework",
  "United States Naval Academy — Engineering coursework",
] as const;

export const aboutHonors =
  "National Defense Service Medal · Expert Rifleman & Pistol Shot · Customer Service Excellence";
