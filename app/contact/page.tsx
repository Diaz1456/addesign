"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          subject: form.get("subject"),
          message: form.get("message"),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Failed to send your message.");
        return;
      }
      setStatus("success");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="kicker">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-deep">
            Let&apos;s build something intent-ful
          </h1>
          <p className="mt-4 max-w-md leading-relaxed text-slate/60">
            Submitting an inquiry creates a ticket in our studio&apos;s
            feedback log so the right engineer or designer picks it up. We
            respond within two working days.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: MapPin, title: "Studio", body: "Level 4, Helios Works, Copenhagen, Denmark" },
              { icon: Mail, title: "Email", body: "hello@aetheria.design" },
              { icon: Phone, title: "Phone", body: "+45 12 34 56 78" },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-deep">{title}</h3>
                  <p className="text-sm text-slate/60">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 lg:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center py-16 text-center">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
              <h2 className="mt-5 text-2xl font-extrabold text-slate-deep">
                Message received
              </h2>
              <p className="mt-2 max-w-sm text-slate/60">
                Your inquiry has been logged. Our studio will reach out soon.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="btn-dark mt-8"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="name">Name</label>
                  <input id="name" name="name" required className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required className="input" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  className="input"
                  placeholder="Custom interior quote, facade consultation…"
                />
              </div>
              <div>
                <label className="label" htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="input resize-none"
                  placeholder="Tell us about your project or the object you have in mind."
                />
              </div>
              {status === "error" && (
                <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}
              <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  "Send Inquiry"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}