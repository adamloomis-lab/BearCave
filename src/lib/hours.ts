import { BUSINESS } from "./constants";

// Live open/closed state computed from the GBP hours in constants.ts.
// Times are America/New_York; the store and nearly all visitors are local,
// so we resolve "now" in that zone explicitly to keep SSR and client agreeing.

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function spanFor(day: string): { opens: string; closes: string } | null {
  for (const h of BUSINESS.hoursSpec) {
    if ((h.days as readonly string[]).includes(day)) return { opens: h.opens, closes: h.closes };
  }
  return null;
}

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function fmt(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hr} ${ampm}` : `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

export type OpenState = {
  open: boolean;
  label: string; // "Open until 9 PM" | "Opens at 8 AM"
};

export function openStateNow(now = new Date()): OpenState {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = get("weekday");
  const nowMin = Number(get("hour")) * 60 + Number(get("minute"));

  const today = spanFor(day);
  if (today && nowMin >= minutesOf(today.opens) && nowMin < minutesOf(today.closes)) {
    return { open: true, label: `Open until ${fmt(today.closes)}` };
  }
  // Before opening today?
  if (today && nowMin < minutesOf(today.opens)) {
    return { open: false, label: `Opens at ${fmt(today.opens)}` };
  }
  // After close: find tomorrow's span.
  const idx = DAY_NAMES.indexOf(day as (typeof DAY_NAMES)[number]);
  const tomorrow = spanFor(DAY_NAMES[(idx + 1) % 7]);
  return {
    open: false,
    label: tomorrow ? `Opens at ${fmt(tomorrow.opens)}` : "Closed",
  };
}
