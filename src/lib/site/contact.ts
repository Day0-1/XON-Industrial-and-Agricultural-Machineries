export function getContactEmail(): string {
  return process.env.CONTACT_EMAIL ?? "info@xonmachineries.com";
}

export function getContactPhone(): string {
  const phone = process.env.CONTACT_PHONE?.trim();
  return phone && phone.length > 0 ? phone : "+234 810 123 4567";
}

export function getContactLocation(): string {
  return process.env.CONTACT_LOCATION?.trim() || "Lagos, Nigeria";
}
