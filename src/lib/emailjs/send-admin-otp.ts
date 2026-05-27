import { getAdminOtpEmail, getOtpEmailJsConfig } from "@/lib/emailjs/server-config";

export async function sendAdminOtpEmail(otp: string): Promise<void> {
  const config = getOtpEmailJsConfig();
  const adminEmail = getAdminOtpEmail();

  if (!config) {
    throw new Error(
      "OTP email is not configured. Set EMAILJS_OTP_TEMPLATE_ID (separate from the contact template) plus EmailJS service keys.",
    );
  }

  if (!adminEmail) {
    throw new Error("ADMIN_OTP_EMAIL is not configured.");
  }

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const time = expiresAt.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  /**
   * OTP template body: {{passcode}}, {{time}}
   * Recipient: set template "To Email" to {{to_email}} (or {{email}} / {{user_email}}).
   */
  const templateParams: Record<string, string> = {
    passcode: otp,
    time,
    to_email: adminEmail,
    email: adminEmail,
    user_email: adminEmail,
  };

  const body: Record<string, unknown> = {
    service_id: config.serviceId,
    template_id: config.otpTemplateId,
    user_id: config.publicKey,
    template_params: templateParams,
  };

  if (config.privateKey) {
    body.accessToken = config.privateKey;
  }

  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      text ? `EmailJS failed: ${text.slice(0, 200)}` : "Failed to send OTP email",
    );
  }
}
