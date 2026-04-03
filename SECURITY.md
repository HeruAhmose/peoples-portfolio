# Security

## Reporting a vulnerability

Please **do not** open a public issue for security-sensitive reports.

- Email the maintainer with a clear description, reproduction steps, and impact.
- Allow a reasonable time to address the issue before public disclosure.

## Secrets and configuration

- Never commit `.env`, `.env.local`, API keys, or database credentials.
- Use `.env.example` as the only tracked reference for variable names.
- Rotate keys immediately if they are exposed (e.g. in chat, logs, or CI output).

## Dependencies

Run `pnpm install` with an up-to-date lockfile. Review `pnpm audit` output periodically and upgrade transitive dependencies as appropriate.
