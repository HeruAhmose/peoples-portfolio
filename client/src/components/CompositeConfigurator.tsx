import { useMemo, useState } from "react";

/**
 * CompositeConfigurator — the Research Lab's working instrument.
 *
 * The page listed the composite's design envelope as static text: pyrolysis
 * 700–1400°C, conductivity 10²–10⁶ S/m, surface area >1500 m²/g. Those ranges
 * are the interesting part, and a reader cannot interrogate a paragraph. This
 * lets them move the two variables that actually drive the envelope and watch
 * the properties respond.
 *
 * Every output is an interpolation across the ranges stated in provisional
 * 63/934,269. Nothing here is a measurement, and the panel says so on its face —
 * the point is to make the design space legible, not to imply data that does
 * not exist yet.
 */

type Constituent = "quartz" | "tourmaline" | "magnetite" | "rareEarth";

const CONSTITUENTS: Record<
  Constituent,
  { label: string; formula: string; effect: string; accent: string }
> = {
  quartz: {
    label: "Quartz",
    formula: "SiO₂",
    effect: "Piezoelectric response",
    accent: "#6ea8da",
  },
  tourmaline: {
    label: "Tourmaline",
    formula: "complex borosilicate",
    effect: "Pyroelectric response",
    accent: "#d98758",
  },
  magnetite: {
    label: "Magnetite",
    formula: "Fe₃O₄",
    effect: "Magnetostriction",
    accent: "#2f765d",
  },
  rareEarth: {
    label: "Rare-earth dopants",
    formula: "Nd, Er, Yb",
    effect: "Optical / spin coherence",
    accent: "#f0cc79",
  },
};

/** Log-interpolate conductivity across the stated 10²–10⁶ S/m envelope. */
function conductivity(tempC: number): number {
  const t = (tempC - 700) / (1400 - 700);
  return Math.pow(10, 2 + t * 4);
}

/**
 * sp² fraction rises with pyrolysis temperature — graphitic ordering increases,
 * sp³ (disordered) content falls. Modelled as a smooth ramp across the range.
 */
function sp2Fraction(tempC: number): number {
  const t = (tempC - 700) / (1400 - 700);
  return 0.35 + 0.55 * (1 - Math.pow(1 - t, 1.6));
}

/**
 * Specific surface area peaks in the mid range: too cool and the pore network
 * has not developed, too hot and it begins to collapse and densify.
 */
function surfaceArea(tempC: number): number {
  const peak = 1050;
  const spread = 320;
  const falloff = Math.exp(-Math.pow((tempC - peak) / spread, 2));
  return 400 + 1300 * falloff;
}

function fmtSI(v: number): string {
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}×10⁶`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(1)}×10³`;
  return v.toFixed(0);
}

export function CompositeConfigurator() {
  const [tempC, setTempC] = useState(1050);
  const [loading, setLoading] = useState(55); // vol% carbon matrix, 40–70
  const [active, setActive] = useState<Record<Constituent, boolean>>({
    quartz: true,
    tourmaline: true,
    magnetite: false,
    rareEarth: false,
  });

  const derived = useMemo(() => {
    const sigma = conductivity(tempC);
    const sp2 = sp2Fraction(tempC);
    const ssa = surfaceArea(tempC);
    // Inclusion volume is whatever the matrix does not occupy, split evenly
    // between the constituents the reader has switched on.
    const on = (Object.keys(active) as Constituent[]).filter(k => active[k]);
    const inclusionVol = 100 - loading;
    const perConstituent = on.length ? inclusionVol / on.length : 0;
    // Transduction modes are a count of enabled physical mechanisms, not a
    // performance figure.
    const modes = on.length;
    return { sigma, sp2, ssa, perConstituent, modes, on };
  }, [tempC, loading, active]);

  const toggle = (k: Constituent) =>
    setActive(prev => ({ ...prev, [k]: !prev[k] }));

  return (
    <section
      className="rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur-sm md:p-8"
      aria-labelledby="composite-configurator-heading"
    >
      <header className="mb-6">
        <p
          className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/40"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          Interactive · design envelope
        </p>
        <h3
          id="composite-configurator-heading"
          className="text-xl text-white md:text-2xl"
          style={{ fontFamily: "var(--font-display, Syne, sans-serif)" }}
        >
          Composite Configurator
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
          Move the process variables and watch the property envelope respond.
          Values are interpolated across the ranges claimed in provisional
          63/934,269 — they describe the intended design space, not laboratory
          measurements.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* ── Controls ─────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label
                htmlFor="pyrolysis-temp"
                className="text-xs uppercase tracking-[0.18em] text-white/70"
                style={{
                  fontFamily: "var(--font-mono, ui-monospace, monospace)",
                }}
              >
                Pyrolysis temperature
              </label>
              <span
                className="text-sm tabular-nums text-[#d6a33a]"
                style={{
                  fontFamily: "var(--font-mono, ui-monospace, monospace)",
                }}
              >
                {tempC} °C
              </span>
            </div>
            <input
              id="pyrolysis-temp"
              type="range"
              min={700}
              max={1400}
              step={10}
              value={tempC}
              onChange={e => setTempC(Number(e.target.value))}
              className="w-full accent-[#d6a33a]"
              aria-describedby="pyrolysis-range"
            />
            <p id="pyrolysis-range" className="mt-1 text-[11px] text-white/35">
              700–1400 °C, the range stated in the filing
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label
                htmlFor="matrix-loading"
                className="text-xs uppercase tracking-[0.18em] text-white/70"
                style={{
                  fontFamily: "var(--font-mono, ui-monospace, monospace)",
                }}
              >
                Carbon matrix loading
              </label>
              <span
                className="text-sm tabular-nums text-[#d6a33a]"
                style={{
                  fontFamily: "var(--font-mono, ui-monospace, monospace)",
                }}
              >
                {loading} vol%
              </span>
            </div>
            <input
              id="matrix-loading"
              type="range"
              min={40}
              max={70}
              step={1}
              value={loading}
              onChange={e => setLoading(Number(e.target.value))}
              className="w-full accent-[#d6a33a]"
              aria-describedby="loading-range"
            />
            <p id="loading-range" className="mt-1 text-[11px] text-white/35">
              40–70 vol%, per claim 1
            </p>
          </div>

          <fieldset>
            <legend
              className="mb-3 text-xs uppercase tracking-[0.18em] text-white/70"
              style={{
                fontFamily: "var(--font-mono, ui-monospace, monospace)",
              }}
            >
              Functional inclusions
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CONSTITUENTS) as Constituent[]).map(k => {
                const c = CONSTITUENTS[k];
                const on = active[k];
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => toggle(k)}
                    aria-pressed={on}
                    className="rounded border px-3 py-2 text-left transition-colors"
                    style={{
                      borderColor: on ? c.accent : "rgba(255,255,255,0.12)",
                      background: on ? `${c.accent}18` : "transparent",
                    }}
                  >
                    <span
                      className="block text-xs font-medium"
                      style={{
                        color: on ? c.accent : "rgba(255,255,255,0.65)",
                      }}
                    >
                      {c.label}
                    </span>
                    <span className="block text-[10px] text-white/40">
                      {c.effect}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* ── Readout ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <Readout
            label="Electrical conductivity"
            value={`${fmtSI(derived.sigma)} S/m`}
            note="log-interpolated across 10²–10⁶ S/m"
            fill={(Math.log10(derived.sigma) - 2) / 4}
          />
          <Readout
            label="sp² / sp³ bonding ratio"
            value={`${(derived.sp2 * 100).toFixed(0)}% sp²`}
            note="graphitic ordering rises with temperature"
            fill={derived.sp2}
          />
          <Readout
            label="Specific surface area"
            value={`${derived.ssa.toFixed(0)} m²/g`}
            note="peaks mid-range; densifies above ~1200 °C"
            fill={derived.ssa / 1700}
          />
          <Readout
            label="Transduction modes enabled"
            value={`${derived.modes} of 4`}
            note={
              derived.on.length
                ? derived.on.map(k => CONSTITUENTS[k].effect).join(" · ")
                : "no inclusions selected"
            }
            fill={derived.modes / 4}
          />

          <div className="rounded border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[11px] leading-relaxed text-white/45">
              Inclusion budget: {(100 - loading).toFixed(0)} vol% split across{" "}
              {derived.on.length || "no"} constituent
              {derived.on.length === 1 ? "" : "s"}
              {derived.on.length
                ? ` — ${derived.perConstituent.toFixed(1)} vol% each`
                : ""}
              .
            </p>
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.2em] text-white/30"
            style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
          >
            Design envelope · not measured data
          </p>
        </div>
      </div>
    </section>
  );
}

function Readout({
  label,
  value,
  note,
  fill,
}: {
  label: string;
  value: string;
  note: string;
  fill: number;
}) {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-xs text-white/70">{label}</span>
        <span
          className="text-sm tabular-nums text-white"
          style={{ fontFamily: "var(--font-mono, ui-monospace, monospace)" }}
        >
          {value}
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-white/10"
        role="presentation"
      >
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#a8522f,#d6a33a,#f0cc79)",
          }}
        />
      </div>
      <p className="mt-1 text-[11px] text-white/35">{note}</p>
    </div>
  );
}

export default CompositeConfigurator;
