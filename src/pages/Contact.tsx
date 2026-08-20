import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Phone,
  MapPin,
  Clock,
  Square,
  Route,
  Footprints,
  Wrench,
  Hammer,
  Building2,
  HelpCircle,
  Send,
  ArrowRight,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { FloatField, SuccessCheck } from "@/components/FluidField";
import { BUSINESS, IMAGES } from "@/lib/constants";

const tel = `tel:${BUSINESS.phone.replace(/[^\d]/g, "")}`;

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

// Single-select icon cards for project type. The submitted `value` is identical
// to the old <select> options so the Netlify form receives the same data.
const SERVICE_OPTIONS: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "Stamped & Decorative Concrete", label: "Stamped Concrete", icon: Square },
  { value: "Concrete Driveways & Flatwork", label: "Driveways & Flatwork", icon: Route },
  { value: "Patios & Walkways", label: "Patios & Walkways", icon: Footprints },
  { value: "Concrete Repair & Maintenance", label: "Concrete Repair", icon: Wrench },
  { value: "Demolition, Masonry & Excavation", label: "Demolition & Excavation", icon: Hammer },
  { value: "Commercial Concrete", label: "Commercial Concrete", icon: Building2 },
  { value: "Other", label: "Other / Not sure", icon: HelpCircle },
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submittedName, setSubmittedName] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Capture the first name before the reset so the thank-you can use it.
    const firstName = form.name.trim().split(/\s+/)[0] || "";
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contact", ...form }),
      });
      setSubmittedName(firstName);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <PageHero
        label="Get in Touch"
        title="Request a Free Quote"
        subtitle="Planning a concrete or construction project? Reach out for a free, no-obligation estimate. We'll walk you through it."
        image={IMAGES.stampedCharcoalBorder}
      />

      <section className="depth-concrete">
        <div className="container-x py-20 md:py-28 grid lg:grid-cols-5 gap-12">
          {/* Contact details */}
          <AnimatedSection direction="left" className="lg:col-span-2">
            <p className="eyebrow">Contact</p>
            <h2 className="display text-3xl md:text-4xl mt-2 text-steel">Let's Talk About Your Project</h2>
            <span className="mt-4 block rule-red" />
            <p className="text-muted-foreground mt-6 leading-relaxed">
              Call us directly or send a message and we'll get back to you to schedule a visit and a
              free quote.
            </p>

            <div className="mt-8 space-y-5">
              <a href={tel} className="flex items-start gap-4 group">
                <span className="flex items-center justify-center w-11 h-11 bg-brand text-white shrink-0"><Phone size={20} /></span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">Phone</span>
                  <span className="block text-steel font-semibold group-hover:text-brand transition-colors">{BUSINESS.phone}</span>
                </span>
              </a>
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-11 h-11 bg-brand text-white shrink-0"><MapPin size={20} /></span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">Service Area</span>
                  <span className="block text-steel font-semibold">{BUSINESS.address.city}, {BUSINESS.address.state} · Within {BUSINESS.serviceRadiusMiles} miles across Medina, Wayne &amp; Summit Counties</span>
                </span>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-11 h-11 bg-brand text-white shrink-0"><Clock size={20} /></span>
                <span>
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">Hours</span>
                  <span className="block text-steel font-semibold">Mon-Fri: 7:00 AM - 5:00 PM</span>
                  <span className="block text-muted-foreground text-sm">Sat 8:00 AM - 12:00 PM · Sun closed</span>
                </span>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection direction="right" className="lg:col-span-3">
            <div className="bg-white border border-border p-7 md:p-10 shadow-sm">
              {status === "success" ? (
                <div
                  className="text-center py-10"
                  style={{ animation: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both" }}
                >
                  <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
                    <SuccessCheck />
                  </span>
                  <h3 className="display text-3xl text-steel">
                    {submittedName ? `Thank You, ${submittedName}!` : "Thank You!"}
                  </h3>
                  <p className="text-muted-foreground mt-4 max-w-md mx-auto leading-relaxed">
                    Your request is on its way to Mike and the crew. We'll be in touch soon to schedule a
                    visit and a free quote. Need an answer right now? Give us a call and we'll help you today.
                  </p>
                  <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                      href={tel}
                      className="group relative inline-flex items-center gap-2 overflow-hidden bg-brand text-white font-semibold uppercase tracking-wide px-7 py-4 hover:bg-brand-dark transition-colors"
                    >
                      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
                      <Phone size={16} /> {BUSINESS.phone}
                    </a>
                  </div>
                  <button
                    onClick={() => { setStatus("idle"); setSubmittedName(""); }}
                    className="mt-6 text-muted-foreground text-xs hover:text-steel transition-colors"
                  >
                    Send another message
                  </button>
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
                    <label>Don't fill this out: <input name="bot-field" onChange={handleChange} /></label>
                  </p>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <FloatField label="Name" name="name" value={form.name} onChange={handleChange} required />
                    <FloatField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                  </div>
                  <FloatField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />

                  {/* Project type as single-select icon cards (value still submits via form.service) */}
                  <fieldset>
                    <legend className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Project Type
                    </legend>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {SERVICE_OPTIONS.map((o) => {
                        const active = form.service === o.value;
                        const Icon = o.icon;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            aria-pressed={active}
                            onClick={() =>
                              setForm((f) => ({ ...f, service: active ? "" : o.value }))
                            }
                            className={`flex flex-col items-start gap-2 border px-3.5 py-3.5 text-left text-sm transition-all duration-200 active:scale-[0.98] ${
                              active
                                ? "border-brand bg-brand text-white shadow-[0_10px_24px_-12px_rgba(108,23,25,0.7)]"
                                : "border-border bg-background text-steel hover:border-brand hover:bg-white"
                            }`}
                          >
                            <Icon size={22} className={active ? "text-white" : "text-brand"} strokeWidth={1.75} />
                            <span className="font-semibold leading-tight">{o.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <FloatField
                    label="Project Details: location, size, timeline, anything helpful"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    textarea
                    rows={5}
                  />

                  {status === "error" && (
                    <p className="text-brand text-sm">Something went wrong. Please call us at {BUSINESS.phone}.</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden bg-brand text-white font-semibold uppercase tracking-wide px-6 py-4 hover:bg-brand-dark transition-colors disabled:opacity-60"
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/30 blur-md group-hover:[animation:sheen_0.9s_ease]" />
                    {status === "submitting" ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending</>
                    ) : (
                      <><Send size={15} /> Request My Free Quote <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" /></>
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
