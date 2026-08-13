import { Fragment, type ReactNode } from "react";

/**
 * Prose — the small markdown renderer H.K. actually needs.
 *
 * This replaces Streamdown in the assistant surfaces. Streamdown carries Shiki
 * with every language grammar, Mermaid, KaTeX and Cytoscape — roughly 14 MB and
 * 400 chunks — to render answers that are plain paragraphs, links and bullets.
 * Handling those four cases directly cuts the published bundle by an order of
 * magnitude with no loss to what the assistant can say.
 *
 * Rendering goes through React elements, never dangerouslySetInnerHTML, so
 * assistant output cannot inject markup.
 */

interface Props {
  children: string;
  className?: string;
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

function safeHref(raw: string): string | null {
  const url = raw.trim();
  if (/^(?:https?:|mailto:|tel:)/i.test(url)) return url;
  if (/^(?:#|\?|\.{1,2}\/)/.test(url)) return url;
  if (/^\/(?!\/)/.test(url)) return url;
  return null;
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text
    .split(INLINE)
    .filter(Boolean)
    .map((token, i) => {
      const key = `${keyPrefix}-${i}`;

      if (token.startsWith("**") && token.endsWith("**")) {
        return (
          <strong key={key} className="font-semibold text-[#f3eddf]">
            {token.slice(2, -2)}
          </strong>
        );
      }

      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={key}
            className="rounded px-1.5 py-0.5 text-[0.85em]"
            style={{
              fontFamily: "var(--font-mono)",
              background: "rgba(214,163,58,0.10)",
              color: "#f0cc79",
            }}
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      if (token.startsWith("[")) {
        const close = token.indexOf("](");
        const label = token.slice(1, close);
        const href = safeHref(token.slice(close + 2, -1));
        if (!href) {
          return <Fragment key={key}>{label}</Fragment>;
        }
        const external = /^https?:/i.test(href);
        return (
          <a
            key={key}
            href={href}
            className="underline underline-offset-2 transition-colors hover:text-[#f0cc79]"
            style={{ color: "#d6a33a" }}
            {...(external
              ? { target: "_blank", rel: "noreferrer noopener" }
              : {})}
          >
            {label}
          </a>
        );
      }

      if (token.startsWith("*") && token.endsWith("*")) {
        return (
          <em key={key} style={{ fontFamily: "var(--font-display)" }}>
            {token.slice(1, -1)}
          </em>
        );
      }

      return <Fragment key={key}>{token}</Fragment>;
    });
}

export function Prose({ children, className = "" }: Props) {
  const blocks = (children ?? "").split(/\n{2,}/).filter(b => b.trim());

  return (
    <div className={`space-y-3 leading-relaxed ${className}`}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isList = lines.every(l => /^\s*[-*•]\s+/.test(l));

        if (isList) {
          return (
            <ul key={bi} className="space-y-1.5 pl-1">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-2.5">
                  <span
                    aria-hidden
                    className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#d6a33a]"
                  />
                  <span>
                    {renderInline(
                      line.replace(/^\s*[-*•]\s+/, ""),
                      `${bi}-${li}`
                    )}
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        const heading = block.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
          const Tag = (["h3", "h4", "h5"] as const)[heading[1].length - 1];
          return (
            <Tag
              key={bi}
              className="text-[#f3eddf]"
              style={{ fontFamily: "var(--font-interface)", fontWeight: 600 }}
            >
              {renderInline(heading[2], `h-${bi}`)}
            </Tag>
          );
        }

        return <p key={bi}>{renderInline(block, `p-${bi}`)}</p>;
      })}
    </div>
  );
}

export default Prose;
