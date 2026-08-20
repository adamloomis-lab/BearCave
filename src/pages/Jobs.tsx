import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Facebook, MapPin, Send, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { FloatField, SuccessCheck } from "@/components/FluidField";
import { BUSINESS } from "@/lib/constants";

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

const AVAILABILITY = ["Days", "Evenings", "Weekends"];

export default function Jobs() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [avail, setAvail] = useState<string[]>([]);
  const [submittedName, setSubmittedName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const toggleAvail = (a: string) =>
    setAvail((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const firstName = form.name.trim().split(/\s+/)[0] || "";
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "application", ...form, availability: avail.join(", ") }),
      });
      setSubmittedName(firstName);
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
      setAvail([]);
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <PageHero
        title="Come work the window"
        subtitle="We're always looking for friendly, reliable people. If you like talking to half the town from a drive-thru window, you'll fit right in."
      />

      <section className="depth-frost">
        <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-5">
          {/* Pitch */}
          <AnimatedSection direction="left" className="lg:col-span-2">
            <h2 className="display text-3xl text-foreground">What the job is</h2>
            <span className="mt-4 block rule-ice" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Fast-paced in the fun way: cars roll through, you grab orders, check IDs,
              run the register, and keep the coolers stocked. Our regulars know the crew
              by name, and the reviews call us family. That's the bar.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Apply right here, or the old-fashioned ways still work too:
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex items-start gap-2.5 text-muted-foreground">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-deep" />
                <span>
                  Grab a paper application at the store: {BUSINESS.address.street},{" "}
                  {BUSINESS.address.city}
                </span>
              </li>
              <li>
                <a
                  href={BUSINESS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-brand-deep"
                >
                  <Facebook size={18} className="mt-0.5 shrink-0 text-brand-deep" />
                  <span>Message us on Facebook: {BUSINESS.social.facebookHandle}</span>
                </a>
              </li>
            </ul>
          </AnimatedSection>

          {/* Application form */}
          <AnimatedSection direction="right" className="lg:col-span-3">
            <div className="border border-border bg-white p-7 shadow-sm md:p-10">
              {status === "success" ? (
                <div
                  className="py-10 text-center"
                  style={{ animation: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
                >
                  <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                    <SuccessCheck />
                  </span>
                  <h3 className="display text-3xl text-foreground">
                    {submittedName ? `Thank You, ${submittedName}!` : "Thank You!"}
                  </h3>
                  <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
                    Application received. If it looks like a fit, we'll reach out to set up
                    a time to talk. Feel free to stop by the store in the meantime and say
                    hello in person.
                  </p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setSubmittedName("");
                    }}
                    className="mt-6 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form
                  name="application"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <input type="hidden" name="form-name" value="application" />
                  <input type="hidden" name="availability" value={avail.join(", ")} />
                  <p className="hidden">
                    <label>
                      Don't fill this out: <input name="bot-field" onChange={handleChange} />
                    </label>
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatField label="Name" name="name" value={form.name} onChange={handleChange} required />
                    <FloatField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
                  </div>
                  <FloatField label="Email" name="email" type="email" value={form.email} onChange={handleChange} />

                  <fieldset>
                    <legend className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      When can you work? Pick all that apply
                    </legend>
                    <div className="grid grid-cols-3 gap-2.5">
                      {AVAILABILITY.map((a) => {
                        const active = avail.includes(a);
                        return (
                          <button
                            key={a}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleAvail(a)}
                            className={`border px-3.5 py-3 text-center text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                              active
                                ? "border-brand bg-brand text-white shadow-[0_10px_24px_-12px_rgba(45,90,160,0.7)]"
                                : "border-border bg-background text-foreground hover:border-brand hover:bg-white"
                            }`}
                          >
                            {a}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <FloatField
                    label="Tell us a little about yourself"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    textarea
                    rows={4}
                  />

                  {status === "error" && (
                    <p className="text-sm text-accent">
                      Something went wrong. Please call us at {BUSINESS.phone} or stop by.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden bg-accent px-6 py-4 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
                    {status === "submitting" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending
                      </>
                    ) : (
                      <>
                        <Send size={15} /> Send My Application
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
