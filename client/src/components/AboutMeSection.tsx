import { motion } from "framer-motion";
import { Download, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import {
  ABOUT_RESUME_PDF_PATH,
  aboutCertificationsResumeSupplement,
  aboutContact,
  aboutEducation,
  aboutExperienceAdditional,
  aboutExperiencePrimary,
  aboutHeadline,
  aboutHonors,
  aboutSkillBullets,
  aboutSummary,
  linkedInLicensesAndCertifications,
} from "@shared/aboutMe";

export default function AboutMeSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6 }}
        className="cyber-panel mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-12"
      >
        <p className="font-mono text-[10px] tracking-[0.35em] text-cyan-400/85 md:text-xs">
          OPERATOR PROFILE /// ABOUT ME
        </p>
        <h2 className="font-display mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Jonathan Peoples
        </h2>
        <p className="mt-2 font-mono text-xs tracking-wide text-primary md:text-sm">
          {aboutHeadline}
        </p>

        <div className="mt-6 flex flex-col gap-3 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-cyan-400/80" />
              {aboutContact.location}
            </span>
            <a
              href={`tel:+1${aboutContact.phone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 text-foreground/90 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4 shrink-0 text-cyan-400/80" />
              {aboutContact.phone}
            </a>
          </div>
          <a
            href={`mailto:${aboutContact.email}`}
            className="inline-flex w-fit items-center gap-2 text-foreground/90 transition-colors hover:text-primary"
          >
            <Mail className="h-4 w-4 shrink-0 text-cyan-400/80" />
            {aboutContact.email}
          </a>
          <a
            href={aboutContact.linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 text-foreground/90 transition-colors hover:text-primary"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-cyan-400/80" />
            {aboutContact.linkedinLabel}
          </a>
          <a
            href={ABOUT_RESUME_PDF_PATH}
            download
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-xs tracking-[0.15em] text-primary transition-colors hover:border-primary hover:bg-primary/15"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD RÉSUMÉ (PDF)
          </a>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-foreground/85 md:text-base">
          {aboutSummary}
        </p>

        <div className="mt-10">
          <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
            Key skills & tools
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {aboutSkillBullets.map(line => (
              <li key={line} className="border-l-2 border-cyan-500/30 pl-3">
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
            Licenses & certifications
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Complete list as shown on{" "}
            <a
              href={aboutContact.linkedinCertificationsDetailsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              LinkedIn · Licenses & certifications
            </a>
            .
          </p>
          <ul className="mt-4 space-y-3 text-sm text-foreground/85">
            {linkedInLicensesAndCertifications.map(c => (
              <li
                key={c.title}
                className="border-l-2 border-primary/35 pl-3 leading-relaxed"
              >
                <span className="font-medium text-foreground">{c.title}</span>
                <span className="mt-0.5 block text-muted-foreground">
                  {c.issuer} · Issued {c.issued}
                  {c.credentialHref ? (
                    <>
                      {" · "}
                      <a
                        href={c.credentialHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                      >
                        View credential
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    </>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/90">
              Résumé PDF also highlights:
            </span>{" "}
            {aboutCertificationsResumeSupplement}
          </p>
        </div>

        <div className="mt-10">
          <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
            Professional experience
          </h3>
          <ul className="mt-4 space-y-6">
            {aboutExperiencePrimary.map(role => (
              <li key={`${role.org}-${role.period}`}>
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
                  <span className="font-semibold text-foreground">
                    {role.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {role.org}
                    {role.location ? ` · ${role.location}` : ""} · {role.period}
                  </span>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground/80">
                  {role.bullets.map(b => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-6 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
            ADDITIONAL ROLES
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/80">
            {aboutExperienceAdditional.map(line => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
              Education
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {aboutEducation.map(line => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold tracking-wide text-foreground">
              Honors
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {aboutHonors}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
