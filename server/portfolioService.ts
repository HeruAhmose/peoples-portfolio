import { and, count, eq } from "drizzle-orm";
import {
  inquiries,
  notificationPreferences,
  timelineEvents,
  visitorEvents,
} from "../drizzle/schema";
import { getDb } from "./db";
import { sendSmtpMail } from "./_core/email";
import { ENV } from "./_core/env";

/** Sections that trigger an owner email the first time a session views them */
export const NOTIFY_OWNER_SECTIONS = new Set([
  "home",
  "materials",
  "community",
  "research",
]);

export async function insertTimeline(
  kind: string,
  title: string,
  detail?: string,
  payload?: unknown
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(timelineEvents).values({
    kind,
    title,
    detail: detail ?? null,
    payload: payload !== undefined ? JSON.stringify(payload) : null,
  });
}

async function countPriorSectionViews(
  sessionId: string,
  section: string
): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const [row] = await db
    .select({ value: count() })
    .from(visitorEvents)
    .where(
      and(
        eq(visitorEvents.sessionId, sessionId),
        eq(visitorEvents.section, section),
        eq(visitorEvents.eventType, "section_view")
      )
    );
  return Number(row?.value ?? 0);
}

export async function logVisitorInteraction(input: {
  sessionId: string;
  eventType: string;
  section: string;
  metadata?: Record<string, unknown>;
}): Promise<{ persisted: boolean }> {
  const db = await getDb();
  if (!db) {
    console.warn("[Portfolio] logVisitorInteraction: database unavailable");
    return { persisted: false };
  }

  const isKeySectionView =
    input.eventType === "section_view" &&
    NOTIFY_OWNER_SECTIONS.has(input.section);

  const priorViews = isKeySectionView
    ? await countPriorSectionViews(input.sessionId, input.section)
    : 0;

  await db.insert(visitorEvents).values({
    sessionId: input.sessionId,
    eventType: input.eventType,
    section: input.section,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
  });

  await insertTimeline(
    "visitor",
    `${input.eventType}: ${input.section}`,
    undefined,
    {
      sessionId: input.sessionId,
      ...input.metadata,
    }
  );

  if (isKeySectionView && priorViews === 0 && ENV.ownerNotifyEmail) {
    const subject = `[Portfolio] Section explored: ${input.section}`;
    const text = `Session ${input.sessionId} opened section "${input.section}" for the first time.\n\nEvent: ${input.eventType}`;
    await sendSmtpMail({
      to: ENV.ownerNotifyEmail,
      subject,
      text,
    });
    await insertTimeline("notification", subject, text, {
      sessionId: input.sessionId,
      section: input.section,
    });
  }

  return { persisted: true };
}

export async function createInquiry(input: {
  email: string;
  subject: string;
  body: string;
}): Promise<{ ok: boolean }> {
  const db = await getDb();
  if (!db) return { ok: false };

  await db.insert(inquiries).values({
    email: input.email,
    subject: input.subject,
    body: input.body,
    status: "new",
  });

  await insertTimeline("inquiry", `New inquiry: ${input.subject}`, input.body, {
    email: input.email,
  });

  if (ENV.ownerNotifyEmail) {
    await sendSmtpMail({
      to: ENV.ownerNotifyEmail,
      subject: `[Portfolio inquiry] ${input.subject}`,
      text: `From: ${input.email}\n\n${input.body}`,
    });
  }

  return { ok: true };
}

export async function upsertNotificationPreferences(input: {
  visitorKey: string;
  email?: string | null;
  notifySectionExplores?: boolean;
  notifyInquiries?: boolean;
}) {
  const db = await getDb();
  if (!db) return { ok: false as const };

  const notifySection = input.notifySectionExplores !== false ? 1 : 0;
  const notifyInq = input.notifyInquiries !== false ? 1 : 0;

  await db
    .insert(notificationPreferences)
    .values({
      visitorKey: input.visitorKey,
      email: input.email ?? null,
      notifySectionExplores: notifySection,
      notifyInquiries: notifyInq,
    })
    .onDuplicateKeyUpdate({
      set: {
        email: input.email ?? null,
        notifySectionExplores: notifySection,
        notifyInquiries: notifyInq,
        updatedAt: new Date(),
      },
    });

  return { ok: true as const };
}
