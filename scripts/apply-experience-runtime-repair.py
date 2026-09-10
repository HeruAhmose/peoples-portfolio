from pathlib import Path


def replace_exact(path: str, old: str, new: str, count: int = 1) -> None:
    p = Path(path)
    s = p.read_text(encoding="utf-8")
    if s.count(old) < count:
        raise SystemExit(
            f"expected text not found enough times in {path}: {old[:140]!r}"
        )
    p.write_text(s.replace(old, new, count), encoding="utf-8")


replace_exact(
    "client/src/hooks/useAudioSystem.ts",
    "  const [isMuted, setIsMuted] = useState(false);",
    "  const [isMuted, setIsMuted] = useState(true);",
)
old = """    const ctx = initAudioContext();
    if (!ctx || isMuted) return;
"""
new = """    if (isMuted) return;
    const ctx = initAudioContext();
    if (!ctx) return;
"""
p = Path("client/src/hooks/useAudioSystem.ts")
s = p.read_text(encoding="utf-8")
n = s.count(old)
if n != 6:
    raise SystemExit(f"expected exactly 6 audio guards, found {n}")
s = s.replace(old, new)
p.write_text(s, encoding="utf-8")

replace_exact(
    "client/src/hooks/useAudioSystem.ts",
    """  // Toggle mute state
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);
""",
    """  // Explicit opt-in owns AudioContext creation and provides an audible confirmation.
  const toggleMute = useCallback(() => {
    if (!isMuted) {
      setIsMuted(true);
      return;
    }

    const ctx = initAudioContext();
    if (ctx.state === \"suspended\") void ctx.resume();

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    const osc = ctx.createOscillator();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(masterVolume * 0.22, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
    osc.type = \"sine\";
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + 0.18);

    setIsMuted(false);
  }, [initAudioContext, isMuted, masterVolume]);
""",
)

replace_exact(
    "client/src/components/Navigation.tsx",
    """            title={audioEnabled ? \"Mute audio\" : \"Unmute audio\"}
            aria-label={audioEnabled ? \"Mute audio\" : \"Unmute audio\"}
""",
    """            title={audioEnabled ? \"Mute audio\" : \"Enable audio\"}
            aria-label={audioEnabled ? \"Mute audio\" : \"Enable audio\"}
            aria-pressed={audioEnabled}
            data-peoples-sound={audioEnabled ? \"on\" : \"off\"}
""",
)
replace_exact(
    "client/src/App.tsx",
    """                onClick={() => setHkAssistantOpen(!hkAssistantOpen)}
""",
    """                onClick={() => {
                  void playClickSound();
                  setHkAssistantOpen(!hkAssistantOpen);
                }}
""",
)
replace_exact(
    "package.json",
    '    "audit:built": "node scripts/audit-built-site.mjs",',
    '    "audit:built": "node scripts/audit-built-site.mjs && node scripts/audit-experience-runtime.mjs",',
)
print("PEOPLES_EXPERIENCE_PATCH=APPLIED")
