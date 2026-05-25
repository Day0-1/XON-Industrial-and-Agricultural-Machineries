export type EmailJsConfig = {
  publicKey: string;
  serviceId: string;
  templateId: string;
};

export function getEmailJsConfig(): EmailJsConfig | null {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY?.trim();
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID?.trim();
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID?.trim();

  if (!publicKey || !serviceId || !templateId) {
    return null;
  }

  return { publicKey, serviceId, templateId };
}

export function isEmailJsConfigured(): boolean {
  return getEmailJsConfig() !== null;
}
