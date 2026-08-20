import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Phone, Send, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import AnimatedSection from "@/components/AnimatedSection";
import { FloatField, SuccessCheck } from "@/components/FluidField";
import { BUSINESS, CATERING, IMAGES } from "@/lib/constants";

const tel = `tel:${BUSINESS.phoneDigits}`;

const encode = (data: Record<string, string>) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k]))
    .join("&");

const OCCASIONS = [...CATERING.occasions, "Something else"];

export default function Catering() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    occasion: "",
    date: "",
    headcount: "",
    message: "",
  });
  const [submittedName, setSubmittedName] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    const firstName = form.name.trim().split(/\s+/)[0] || "";
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "catering", ...form }),
      });
      setSubmittedName(firstName);
      setStatus("success");
      setForm({ name: "", phone: "", email: "", occasion: "", date: "", headcount: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout>
      <PageHero
        title="Beverage catering"
        subtitle="Weddings, office events, graduations, backyard blowouts. You plan the party; we make sure nobody stands in front of an empty cooler."
      />

      <section className="depth-frost">
        <div className="container-x grid gap-12 py-16 md:py-24 lg:grid-cols-5">
          {/* Pitch */}
          <AnimatedSection direction="left" className="lg:col-span-2">
            <h2 className="display text-3xl text-foreground">How it works</h2>
            <span className="mt-4 block rule-ice" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Tell us the occasion, the date, and roughly how many people are coming. We'll
              talk through what to stock, beer, wine, seltzers, pop, and mixers, and have
              it cold and ready. The sign out front says it because we do it:{" "}
              {CATERING.occasions.join(", ").toLowerCase()}, and more.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Prefer the phone? Call the store and we'll talk it through.
            </p>
            <a
              href={tel}
              className="mt-7 inline-flex items-center gap-2.5 bg-brand px-7 py-3.5 font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-deep"
            >
              <Phone size={16} /> {BUSINESS.phone}
            </a>
            <figure className="mt-10 hidden border border-border bg-white p-2 lg:block">
              <img
                src={IMAGES.mascot}
                alt="The Bear Cave polar bear mascot holding a bottle outside a snowy cave"
                className="h-auto w-full"
                loading="lazy"
              />
            </figure>
          </AnimatedSection>

          {/* Form */}
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
                    Your event details are in. We'll call you to talk through the drink
                    list and lock in the date. Need an answer today? Ring the store and
                    we'll sort it out on the spot.
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
                      Send another request
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  name="catering"
                  method="POST"
                  data-netlify="true"
                  netlify-honeypot="bot-field"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <input type="hidden" name="form-name" value="catering" />
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
                      What's the occasion?
                    </legend>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {OCCASIONS.map((o) => {
                        const active = form.occasion === o;
                        return (
                          <button
                            key={o}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setForm((f) => ({ ...f, occasion: active ? "" : o }))}
                            className={`border px-3.5 py-3 text-left text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                              active
                                ? "border-brand bg-brand text-white shadow-[0_10px_24px_-12px_rgba(45,90,160,0.7)]"
                                : "border-border bg-background text-foreground hover:border-brand hover:bg-white"
                            }`}
                          >
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FloatField label="Event date" name="date" value={form.date} onChange={handleChange} />
                    <FloatField label="Rough headcount" name="headcount" value={form.headcount} onChange={handleChange} />
                  </div>

                  <FloatField
                    label="Anything else: venue, drink preferences, timing"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    textarea
                    rows={4}
                  />

                  {status === "error" && (
                    <p className="text-sm text-accent">
                      Something went wrong. Please call us at {BUSINESS.phone}.
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
                        <Send size={15} /> Start the Conversation
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
