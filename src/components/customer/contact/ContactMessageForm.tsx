"use client";

import { useState } from "react";
import { sendContactEmail } from "@/lib/emailjs/send-contact";
import { isEmailJsConfigured } from "@/lib/emailjs/config";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:opacity-60";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export function ContactMessageForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const emailJsReady = isEmailJsConfigured();

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (success) setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!fullName || !email || !phone || !subject || !message) {
      setError("Please fill in all fields.");
      return;
    }

    if (!emailJsReady) {
      setError(
        "Message sending is not configured yet. Please use phone, email, or WhatsApp on the left.",
      );
      return;
    }

    setSending(true);

    try {
      await sendContactEmail({
        fullName,
        email,
        phone,
        subject,
        message,
      });
      setForm(initialState);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not send your message. Please try again or contact us directly.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-full rounded-2xl bg-white p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">Send Us a Message</h2>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="contact-name"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            className={inputClass}
            disabled={sending}
            required
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass}
            disabled={sending}
            required
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="text-sm font-medium text-slate-700">
            Phone Number
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            className={inputClass}
            disabled={sending}
            required
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={form.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            className={inputClass}
            disabled={sending}
            required
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
            Your Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className={`${inputClass} min-h-32 resize-y`}
            disabled={sending}
            required
          />
        </div>

        {success && (
          <p
            className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            role="status"
          >
            Thank you — your message was sent. We will get back to you soon.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-sm font-bold text-slate-900 transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-40"
        >
          {sending ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}
