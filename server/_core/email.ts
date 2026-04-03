import nodemailer from "nodemailer";
import { ENV } from "./env";

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Sends email via SMTP when SMTP_HOST and credentials are configured.
 * Returns false if SMTP is not configured or send fails (logs warning).
 */
export async function sendSmtpMail(input: SendMailInput): Promise<boolean> {
  if (!ENV.smtpHost || !ENV.ownerNotifyEmail) {
    console.warn("[Email] SMTP_HOST or OWNER_NOTIFY_EMAIL not set; skipping send.");
    return false;
  }

  const from = ENV.smtpFrom || ENV.smtpUser || ENV.ownerNotifyEmail;

  try {
    const transporter = nodemailer.createTransport({
      host: ENV.smtpHost,
      port: ENV.smtpPort,
      secure: ENV.smtpPort === 465,
      auth:
        ENV.smtpUser && ENV.smtpPass
          ? { user: ENV.smtpUser, pass: ENV.smtpPass }
          : undefined,
    });

    await transporter.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return true;
  } catch (e) {
    console.warn("[Email] Send failed:", e);
    return false;
  }
}
