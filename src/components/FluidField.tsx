import type { ChangeEvent } from "react";

// Shared "fluid" form controls for Bear Cave, tuned for the frost form
// surface: floating-label fields (glacial-blue center-out underline + focus
// glow) and an animated drawn checkmark for the personalized thank-you state.

interface FloatFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  idPrefix?: string;
}

export function FloatField({
  name,
  label,
  value,
  onChange,
  type = "text",
  required,
  textarea,
  rows = 5,
  idPrefix = "f",
}: FloatFieldProps) {
  const id = `${idPrefix}-${name}`;
  const input =
    "peer w-full bg-transparent px-4 pt-6 pb-2 font-sans text-foreground text-base placeholder-transparent outline-none";
  const labelCls =
    "pointer-events-none absolute left-4 top-4 origin-left font-sans text-base text-muted-foreground transition-all duration-200 " +
    "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-[0.16em] peer-focus:text-brand " +
    "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.16em] peer-[:not(:placeholder-shown)]:text-muted-foreground";
  return (
    <div className="group relative border border-border bg-background transition-all duration-300 focus-within:border-brand/60 focus-within:bg-white focus-within:shadow-[0_10px_30px_-14px_rgba(45,90,160,0.45)]">
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          required={required}
          placeholder=" "
          value={value}
          onChange={onChange}
          className={`${input} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          required={required}
          placeholder=" "
          value={value}
          onChange={onChange}
          className={input}
        />
      )}
      <label htmlFor={id} className={labelCls}>
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-0.5 w-[calc(100%-2rem)] -translate-x-1/2 scale-x-0 bg-brand transition-transform duration-300 peer-focus:scale-x-100"
      />
    </div>
  );
}

// Animated drawn checkmark for the personalized thank-you state.
export function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="3"
        strokeDasharray="151"
        strokeDashoffset="151"
        style={{ animation: "draw-check 0.6s ease forwards" }}
      />
      <path
        d="M15 27 l7 7 l15 -16"
        fill="none"
        stroke="var(--color-brand)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="40"
        strokeDashoffset="40"
        style={{ animation: "draw-check 0.4s 0.5s ease forwards" }}
      />
    </svg>
  );
}
