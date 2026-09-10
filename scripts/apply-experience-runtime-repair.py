from pathlib import Path


def replace_exact(path: str, old: str, new: str, count: int = 1) -> None:
    p=Path(path); s=p.read_text(encoding='utf-8')
    if s.count(old) < count: raise SystemExit(f'expected text not found enough times in {path}: {old[:140]!r}')
    p.write_text(s.replace(old,new,count),encoding='utf-8')

replace_exact('client/src/hooks/useAudioSystem.ts','  const [isMuted, setIsMuted] = useState(false);','  const [isMuted, setIsMuted] = useState(true);')
old='''    const ctx = initAudioContext();
    if (!ctx || isMuted) return;
'''
new='''    if (isMuted) return;
    const ctx = initAudioContext();
    if (!ctx) return;
'''
p=Path('client/src/hooks/useAudioSystem.ts');s=p.read_text(encoding='utf-8');n=s.count(old)
if n < 7: raise SystemExit(f'expected >=7 audio guards, found {n}')
p.write_text(s.replace(old,new),encoding='utf-8')

replace_exact(
 'client/src/components/Navigation.tsx',
 '''            title={audioEnabled ? "Mute audio" : "Unmute audio"}
            aria-label={audioEnabled ? "Mute audio" : "Unmute audio"}
''',
 '''            title={audioEnabled ? "Mute audio" : "Enable audio"}
            aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
            aria-pressed={audioEnabled}
            data-peoples-sound={audioEnabled ? "on" : "off"}
''')
replace_exact(
 'client/src/App.tsx',
 '''                onClick={() => setHkAssistantOpen(!hkAssistantOpen)}
''',
 '''                onClick={() => {
                  void playClickSound();
                  setHkAssistantOpen(!hkAssistantOpen);
                }}
''')
replace_exact(
 'package.json',
 '    "audit:built": "node scripts/audit-built-site.mjs",',
 '    "audit:built": "node scripts/audit-built-site.mjs && node scripts/audit-experience-runtime.mjs",')
print('PEOPLES_EXPERIENCE_PATCH=APPLIED')
