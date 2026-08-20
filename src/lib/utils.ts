type ClassValue = string | number | null | undefined | false | ClassValue[];

// Minimal classname joiner: concatenates truthy values, flattens arrays.
// No clsx/tailwind-merge dependency; this project's variants don't conflict in
// ways that need real class deduping.
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const i of inputs) {
    if (!i) continue;
    if (Array.isArray(i)) out.push(cn(...i));
    else out.push(String(i));
  }
  return out.join(" ");
}
