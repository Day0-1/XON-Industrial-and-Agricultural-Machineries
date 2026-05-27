export type EmailJsOtpConfig = {
  publicKey: string;
  serviceId: string;
  otpTemplateId: string;
  privateKey?: string;
};

/** Admin OTP only — never uses the contact form template. */
export function getOtpEmailJsConfig(): EmailJsOtpConfig | null {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim();
  const otpTemplateId = process.env.EMAILJS_OTP_TEMPLATE_ID?.trim();
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();

  if (!publicKey || !serviceId || !otpTemplateId) {
    return null;
  }

  return { publicKey, serviceId, otpTemplateId, privateKey };
}

/** Sole recipient for admin login OTP emails. */
export function getAdminOtpEmail(): string | null {
  const email = process.env.ADMIN_OTP_EMAIL?.trim();
  return email && email.includes("@") ? email : null;
}

export function isOtpEmailConfigured(): boolean {
  return Boolean(getOtpEmailJsConfig() && getAdminOtpEmail());
}
