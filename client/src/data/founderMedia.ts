export type FounderMediaChapter =
  "hero" | "origins" | "football" | "track" | "navy" | "present";

export interface FounderMediaAsset {
  id: string;
  chapter: FounderMediaChapter;
  series: string;
  eyebrow: string;
  title: string;
  caption: string;
  throughline: string;
  alt: string;
  src: string;
  focal: string;
  width: number;
  height: number;
  kind: "photo" | "archive";
}

export const FOUNDER_MEDIA: readonly FounderMediaAsset[] = [
  {
    id: "founder-present-portrait",
    chapter: "hero",
    series: "Founder Present",
    eyebrow: "FOUNDER PRESENT",
    title: "Jonathan Peoples",
    caption: "Current professional portrait.",
    throughline:
      "The present frame anchors the archive: service, technical training, family, and founder systems converge here.",
    alt: "Professional portrait of Jonathan Peoples smiling near a large window, wearing a floral shirt and red tie.",
    src: `${import.meta.env.BASE_URL}media/founder/hero/founder-present-portrait.webp`,
    focal: "50% 35%",
    width: 1024,
    height: 1535,
    kind: "photo",
  },
  {
    id: "origins-young-authors",
    chapter: "origins",
    series: "Early Archive",
    eyebrow: "ORIGINS",
    title: "Early creative recognition",
    caption:
      "Kannapolis Young Authors recognition from the early school years.",
    throughline:
      "Creative expression appears early in the record, before athletics, service, and technology become visible chapters.",
    alt: "Cropped archival newspaper page titled Kannapolis Young Authors winners, with rows of student portraits.",
    src: `${import.meta.env.BASE_URL}media/founder/origins/young-authors-clipping.webp`,
    focal: "50% 50%",
    width: 750,
    height: 800,
    kind: "archive",
  },
  {
    id: "origins-newspaper-feature",
    chapter: "origins",
    series: "Early Archive",
    eyebrow: "KANNAPOLIS",
    title: "Student years",
    caption:
      "Archival school-library portrait from a Kannapolis newspaper feature.",
    throughline:
      "The archive shows a student identity taking shape alongside the athletic discipline that would soon become more visible.",
    alt: "Archival newspaper photograph of a young Jonathan Peoples seated at a table in a school library.",
    src: `${import.meta.env.BASE_URL}media/founder/origins/newspaper-feature.webp`,
    focal: "50% 52%",
    width: 720,
    height: 655,
    kind: "archive",
  },
  {
    id: "football-kannapolis-sideline",
    chapter: "football",
    series: "Kannapolis Football",
    eyebrow: "KANNAPOLIS FOOTBALL",
    title: "Friday-night formation",
    caption:
      "Kannapolis football after the game: teammates, repetition, and shared pressure.",
    throughline:
      "Football trained execution under contact. Preparation mattered because the next decision arrived at full speed.",
    alt: "Kannapolis football players in green uniforms gathered on the sideline.",
    src: `${import.meta.env.BASE_URL}media/founder/football/kannapolis-sideline.webp`,
    focal: "55% 48%",
    width: 1080,
    height: 671,
    kind: "photo",
  },
  {
    id: "football-kannapolis-action",
    chapter: "football",
    series: "Kannapolis Football",
    eyebrow: "KANNAPOLIS FOOTBALL",
    title: "Through contact",
    caption: "Kannapolis game-day action with the ball moving through contact.",
    throughline:
      "The athletic lesson was not force alone; it was balance, continuation, and staying decisive when the path narrowed.",
    alt: "Kannapolis football ball carrier in a green uniform running through a tackle.",
    src: `${import.meta.env.BASE_URL}media/founder/football/kannapolis-action.webp`,
    focal: "43% 50%",
    width: 884,
    height: 1164,
    kind: "photo",
  },
  {
    id: "football-kannapolis-ranking",
    chapter: "football",
    series: "Kannapolis Football",
    eyebrow: "COMMUNITY ARCHIVE",
    title: "K-Town running-back legacy",
    caption:
      "Friday Nights in K-Town lists Jonathan Peoples at No. 14 in a community Top 20 of prolific Kannapolis running backs.",
    throughline:
      "Local memory preserves the chapter beyond a stat line: performance becomes part of the place that formed it.",
    alt: "Friday Nights in K-Town graphic listing twenty prolific Kannapolis running backs, including Jonathan Peoples at number fourteen.",
    src: `${import.meta.env.BASE_URL}media/founder/football/kannapolis-ranking.webp`,
    focal: "50% 50%",
    width: 1170,
    height: 881,
    kind: "archive",
  },
  {
    id: "football-maritime-huddle",
    chapter: "football",
    series: "Maritime Football",
    eyebrow: "MARITIME FOOTBALL",
    title: "Team before self",
    caption: "Maritime football gathered before the next phase of competition.",
    throughline:
      "A different program, the same requirement: individual ability had to resolve into collective execution.",
    alt: "Maritime football team gathered together with helmets raised.",
    src: `${import.meta.env.BASE_URL}media/founder/football/maritime-huddle.webp`,
    focal: "52% 44%",
    width: 720,
    height: 479,
    kind: "photo",
  },
  {
    id: "football-maritime-action",
    chapter: "football",
    series: "Maritime Football",
    eyebrow: "MARITIME FOOTBALL",
    title: "Forward drive",
    caption: "Maritime football action during a run through traffic.",
    throughline:
      "Forward motion became a practical habit: absorb resistance, retain control, and keep the objective in view.",
    alt: "Maritime football ball carrier in a dark jersey running through a tackle.",
    src: `${import.meta.env.BASE_URL}media/founder/football/maritime-action.webp`,
    focal: "48% 42%",
    width: 479,
    height: 720,
    kind: "photo",
  },
  {
    id: "football-maritime-portrait",
    chapter: "football",
    series: "Maritime Football",
    eyebrow: "MARITIME",
    title: "No. 6",
    caption: "Maritime football portrait in the number six jersey.",
    throughline:
      "The portrait marks continuity across programs: a competitive identity carried forward, not restarted.",
    alt: "Football portrait of Jonathan Peoples wearing a white Maritime number six jersey.",
    src: `${import.meta.env.BASE_URL}media/founder/football/maritime-portrait.webp`,
    focal: "50% 38%",
    width: 200,
    height: 245,
    kind: "photo",
  },
  {
    id: "track-kannapolis-relay",
    chapter: "track",
    series: "Kannapolis Track",
    eyebrow: "KANNAPOLIS TRACK",
    title: "Relay precision",
    caption: "Kannapolis relay competition with the baton in motion.",
    throughline:
      "Track compressed performance into timing: speed only counted when the exchange was precise.",
    alt: "Kannapolis track athletes running a relay with a baton.",
    src: `${import.meta.env.BASE_URL}media/founder/track/kannapolis-relay.webp`,
    focal: "45% 50%",
    width: 1080,
    height: 1449,
    kind: "photo",
  },
  {
    id: "track-kannapolis-sprint",
    chapter: "track",
    series: "Kannapolis Track",
    eyebrow: "KANNAPOLIS TRACK",
    title: "Finish speed",
    caption: "Kannapolis sprinters driving toward the finish.",
    throughline:
      "Acceleration, control, and finishing became measurable rather than abstract: the clock removed ambiguity.",
    alt: "Three track athletes sprinting toward the finish, with Kannapolis runners on both sides.",
    src: `${import.meta.env.BASE_URL}media/founder/track/kannapolis-sprint.webp`,
    focal: "50% 45%",
    width: 1080,
    height: 696,
    kind: "photo",
  },
  {
    id: "navy-group",
    chapter: "navy",
    series: "Service",
    eyebrow: "SERVICE",
    title: "Navy chapter",
    caption: "Group photograph from the Navy and academy chapter.",
    throughline:
      "Service added a different standard of accountability: mission, team, structure, and responsibility beyond the individual.",
    alt: "Group of service members in white uniforms posing together indoors.",
    src: `${import.meta.env.BASE_URL}media/founder/navy/navy-group.webp`,
    focal: "50% 48%",
    width: 604,
    height: 407,
    kind: "photo",
  },
  {
    id: "navy-academy-yearbook",
    chapter: "navy",
    series: "Service",
    eyebrow: "ACADEMY ARCHIVE",
    title: "Academy-era record",
    caption:
      "Cropped archival yearbook page from the academy and service period.",
    throughline:
      "The formal portrait records entry into an institution where standards, systems, and duty were explicit.",
    alt: "Cropped yearbook page with academy-style portraits, including a portrait labeled Jonathan O Peoples.",
    src: `${import.meta.env.BASE_URL}media/founder/navy/academy-yearbook.webp`,
    focal: "50% 58%",
    width: 720,
    height: 1155,
    kind: "archive",
  },
  {
    id: "npower-podium",
    chapter: "present",
    series: "Technology & Cybersecurity",
    eyebrow: "NPOWER",
    title: "Technology & cybersecurity graduation",
    caption: "Speaking at the podium during the NPower graduation chapter.",
    throughline:
      "NPower formalized a deliberate technical transition, connecting service discipline to contemporary systems and cybersecurity work.",
    alt: "Jonathan Peoples smiling while speaking at a podium during an NPower event.",
    src: `${import.meta.env.BASE_URL}media/founder/present/npower-podium.webp`,
    focal: "44% 42%",
    width: 1388,
    height: 1042,
    kind: "photo",
  },
  {
    id: "npower-recognition",
    chapter: "present",
    series: "Technology & Cybersecurity",
    eyebrow: "NPOWER",
    title: "Recognition in the room",
    caption:
      "A graduation moment with peers and guests responding in the room.",
    throughline:
      "The transition was social as well as technical: learning, peers, mentors, and public accountability all became part of the next chapter.",
    alt: "Jonathan Peoples standing and smiling at an NPower event while people nearby applaud.",
    src: `${import.meta.env.BASE_URL}media/founder/present/npower-recognition.webp`,
    focal: "50% 44%",
    width: 978,
    height: 652,
    kind: "photo",
  },
  {
    id: "wedding-partnership",
    chapter: "present",
    series: "Family & Partnership",
    eyebrow: "PARTNERSHIP",
    title: "Wedding day",
    caption: "A close wedding-day portrait.",
    throughline:
      "Partnership is not outside the founder story. It is part of the human context that gives the work consequence.",
    alt: "Wedding couple smiling together, with red roses visible beside them.",
    src: `${import.meta.env.BASE_URL}media/founder/present/wedding-partnership.webp`,
    focal: "50% 38%",
    width: 1091,
    height: 727,
    kind: "photo",
  },
  {
    id: "wedding-family",
    chapter: "present",
    series: "Family & Partnership",
    eyebrow: "FAMILY",
    title: "Family on the wedding day",
    caption: "Wedding-day family portrait in green and white.",
    throughline:
      "The systems are meant to outlast the moment of invention. Family makes continuity, responsibility, and the future concrete.",
    alt: "Wedding-day family portrait with four people dressed in green and white.",
    src: `${import.meta.env.BASE_URL}media/founder/present/wedding-family.webp`,
    focal: "50% 46%",
    width: 711,
    height: 1067,
    kind: "photo",
  },
  {
    id: "wedding-family-bw",
    chapter: "present",
    series: "Family & Partnership",
    eyebrow: "FAMILY ARCHIVE",
    title: "Continuity",
    caption: "Black-and-white family portrait from the wedding celebration.",
    throughline:
      "The archive shifts from achievement to continuity: the founder is one node inside a larger family story.",
    alt: "Black-and-white wedding-day family portrait with four people smiling together.",
    src: `${import.meta.env.BASE_URL}media/founder/present/wedding-family-bw.webp`,
    focal: "50% 46%",
    width: 1281,
    height: 1920,
    kind: "photo",
  },
  {
    id: "wedding-las-vegas",
    chapter: "present",
    series: "Family & Partnership",
    eyebrow: "WEDDING DAY",
    title: "A new chapter",
    caption: "Wedding-day portrait on a rain-washed Las Vegas street.",
    throughline:
      "The present chapter contains both systems building and life building. Neither needs to be reduced to the other.",
    alt: "Wedding couple standing under an umbrella on a wet Las Vegas street.",
    src: `${import.meta.env.BASE_URL}media/founder/present/wedding-las-vegas.webp`,
    focal: "50% 62%",
    width: 1024,
    height: 1535,
    kind: "photo",
  },
] as const;

export const FOUNDER_MEDIA_CHAPTERS = [
  {
    id: "origins",
    label: "Origins",
    signal: "SALISBURY → KANNAPOLIS",
    description:
      "Early creative recognition and Kannapolis archives establish the first throughline: curiosity, language, place, and community before the technical work.",
  },
  {
    id: "football",
    label: "Football",
    signal: "PREPARATION → CONTACT → EXECUTION",
    description:
      "Football trained execution under pressure: preparation, trust, repetition, balance through contact, and forward motion when the path narrowed.",
  },
  {
    id: "track",
    label: "Track",
    signal: "ACCELERATION → TIMING → FINISH",
    description:
      "Track made performance measurable. Speed mattered, but so did exchange timing, control, and the ability to finish under a clock.",
  },
  {
    id: "navy",
    label: "Navy",
    signal: "SERVICE → STANDARD → MISSION",
    description:
      "Service added institutional discipline: accountability to a team, standards larger than the individual, and resilience inside a defined mission.",
  },
  {
    id: "present",
    label: "Founder Present",
    signal: "TRAINING → FAMILY → SYSTEMS",
    description:
      "NPower formalized the technology and cybersecurity transition; family and partnership keep the purpose human; the current founder systems turn accumulated discipline into infrastructure.",
  },
] as const;

export function founderMediaForChapter(chapter: FounderMediaChapter) {
  return FOUNDER_MEDIA.filter(asset => asset.chapter === chapter);
}

export const FOUNDER_HERO =
  FOUNDER_MEDIA.find(asset => asset.id === "founder-present-portrait") ??
  FOUNDER_MEDIA[0];
