const SKILL_SYNONYMS: Record<string, string> = {
  'java script': 'JavaScript',
  'js': 'JavaScript',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'ts': 'TypeScript',
  'reactjs': 'React',
  'postgres': 'PostgreSQL',
  'aws': 'Amazon Web Services',
  'gcp': 'Google Cloud Platform',
  'c++': 'C++',
  'c#': 'C#',
};

export function normalizeSkills(raw: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  
  for (const s of raw) {
    if (!s) continue;
    const key = s.trim().toLowerCase();
    const canonical = SKILL_SYNONYMS[key] ?? s.trim();
    if (!seen.has(canonical.toLowerCase())) {
      seen.add(canonical.toLowerCase());
      out.push(canonical);
    }
  }
  
  return out;
}
