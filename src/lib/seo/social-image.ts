const CLOUDINARY_HOST = "res.cloudinary.com";
const UPLOAD_SEGMENT = "/upload/";
const TRANSFORM_TOKENS = /(?:^|,)(c_|w_|h_|f_|q_|g_|ar_|dpr_|e_)/;

function isTransformSegment(segment: string): boolean {
  return segment.includes(",") || TRANSFORM_TOKENS.test(segment);
}

/** Cloudinary URL sized for link previews (Open Graph / Twitter). */
export function toSocialPreviewImageUrl(
  src: string,
  width: number,
  height: number,
): string {
  if (!src.includes(CLOUDINARY_HOST) || !src.includes(UPLOAD_SEGMENT)) {
    return src;
  }

  const transform = `c_fill,w_${width},h_${height},f_auto,q_auto`;
  const markerIndex = src.indexOf(UPLOAD_SEGMENT);
  const prefix = src.slice(0, markerIndex + UPLOAD_SEGMENT.length);
  const suffix = src.slice(markerIndex + UPLOAD_SEGMENT.length);
  const slashIndex = suffix.indexOf("/");

  if (slashIndex === -1) {
    if (isTransformSegment(suffix)) return src;
    return `${prefix}${transform}/${suffix}`;
  }

  const firstSegment = suffix.slice(0, slashIndex);
  const rest = suffix.slice(slashIndex + 1);

  if (isTransformSegment(firstSegment)) {
    return `${prefix}${transform}/${rest}`;
  }

  return `${prefix}${transform}/${suffix}`;
}
