import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Phone, MapPin, Facebook, Send, Loader2, ChevronDown, Navigation as NavArrow } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { FloatField, SuccessCheck } from "@/components/FluidField";
import { BUSINESS, FAQS } from "@/lib/constants";
import { openStateNow } from "@/lib/hours";

const tel = `tel:${BUSINESS.phoneDigits}`;
const a = BUSINESS.address;
const mapsQuery = encodeURIComponent(`${BUSINESS.name}, ${a.street}, ${a.city}, ${a.state} ${a.zip}`);
const directions = `https://maps.google.com/?q=${mapsQuery}`;

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submittedName, setSubmittedName] = useState("");
  const openState = useMemo(() => openStateNow(), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const firstName = form.name.trim().split(/\s+/)[0] || "";
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSubmittedName(firstName);
      setStatus("success");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <PageHero
        title="Find the cave"
        subtitle={`474 College St, Wadsworth. ${openState.label}.`}
      />

      {/* Hours + map */}
      <section className="depth-frost">
        <div className="container-x grid gap-10 py-16 md:py-24 lg:grid-cols-2">
          <AnimatedSection direction="left">
            <div className="border border-border bg-white p-7 shadow-sm md:p-9">
              <div className="flex items-center justify-between gap-4">
                <h2 className="display text-2xl text-foreground">Hours</h2>
                <span className={`plaque ${openState.open ? "text-brand-deep" : ""}`}>
                  {openState.label}
                </span>
              </div>
              <table className="mt-5 w-full">
                <tbody>
                  {BUSINESS.hours.map((h) => (
                    <tr key={h.day} className="border-b border-border last:border-0">
                      <td className="py-2.5 font-semibold text-foreground">{h.day}</td>
                      <td className="py-2.5 text-right text-muted-foreground">{h.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 space-y-3 border-t-2 border-border pt-5 text-sm">
                <a href={tel} className="flex items-center gap-2.5 font-semibold text-foreground transition-colors hover:text-brand-deep">
                  <Phone size={17} className="text-brand-deep" /> {BUSINESS.phone}
                </a>
                <a
                  href={directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-muted-foreground transition-colors hover:text-brand-deep"
                >
                  <MapPin size={17} className="mt-0.5 text-brand-deep" />
                  <span>
                    {a.street}, {a.city}, {a.state} {a.zip}
                  </span>
                </a>
                <a
                  href={BUSINESS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-brand-deep"
                >
                  <Facebook size={17} className="text-brand-deep" /> {BUSINESS.social.facebookHandle}
                </a>
              </div>
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative mt-6 inline-flex w-full items-center justify-center gap-2.5 overflow-hidden bg-accent px-6 py-3.5 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent-deep"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
                <NavArrow size={16} /> Get Directions
              </a>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="h-full min-h-[360px] border border-border bg-white p-2 shadow-sm">
              <iframe
                title={`Map to ${BUSINESS.name}`}
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                className="h-full min-h-[344px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Message form */}
      <section className="depth-ice">
        <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-5">
          <AnimatedSection direction="left" className="lg:col-span-2">
            <h2 className="display text-3xl text-foreground">Send us a message</h2>
            <span className="mt-4 block rule-ice" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Question about what's in stock, the lottery, catering, or anything else?
              Drop it here and we'll get back to you. If it's urgent, the phone is faster:
              someone's at the window all day.
            </p>
          </AnimatedSection>

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
                    Message received. We'll get back to you soon. Need an answer right
                    now? Give us a call and we'll help you today.
                  </p>
                  <a
                    href={tel}
                    className="mt-7 inline-flex items-center gap-2 bg-brand px-7 py-4 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-deep"
                  >
                    <Phone size={16} /> {BUSINESS.phone}
                  </a>
                  <div>
                    <button
                      onClick={() => {
                        setStatus("idle");
                        setSubmittedName("");
                      }}
                      className="mt-6 text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  name="contact"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <p className="hidden">
                    <label>
                      Don't fill this out: <input name="bot-field" onChange={handleChange} />
                    </label>
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatField label="Name" name="name" value={form.name} onChange={handleChange} required />
                    <FloatField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                  </div>
                  <FloatField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  <FloatField
                    label="What can we help with?"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    textarea
                    rows={5}
                    required
                  />

                  {status === "error" && (
                    <p className="text-sm text-accent">
                      Something went wrong. Please call us at{" "}
                      <a href={tel} className="font-semibold underline underline-offset-2">
                        {BUSINESS.phone}
                      </a>
                      .
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
                        <Send size={15} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="depth-frost">
        <div className="container-x py-16 md:py-24">
          <AnimatedSection className="max-w-2xl">
            <h2 className="display text-3xl md:text-4xl text-foreground">Quick answers</h2>
            <span className="mt-4 block rule-ice" />
          </AnimatedSection>
          <div className="mt-9 grid gap-3 lg:grid-cols-2">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group border border-border bg-white open:shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display uppercase tracking-wide text-foreground [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-brand-deep transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
