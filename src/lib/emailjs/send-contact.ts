import emailjs from "@emailjs/browser";
import { getEmailJsConfig } from "@/lib/emailjs/config";

export type ContactFormPayload = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

/**
 * Sends the contact form via EmailJS.
 * Matches the "Contact Us" template: title, name, email, message, time.
 */
export async function sendContactEmail(
  payload: ContactFormPayload,
): Promise<void> {
  const config = getEmailJsConfig();
  if (!config) {
    throw new Error(
      "Email is not configured yet. Add EmailJS keys to your environment variables.",
    );
  }

  const messageWithPhone = `${payload.message}\n\nPhone: ${payload.phone}`;

  const templateParams = {
    title: payload.subject,
    name: payload.fullName,
    email: payload.email,
    message: messageWithPhone,
    time: new Date().toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  await emailjs.send(
    config.serviceId,
    config.templateId,
    templateParams,
    { publicKey: config.publicKey },
  );
}
