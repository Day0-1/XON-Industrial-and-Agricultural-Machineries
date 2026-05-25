type LoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const CLOUDINARY_HOST = "res.cloudinary.com";
const UPLOAD_SEGMENT = "/upload/";
const TRANSFORM_TOKENS = /(?:^|,)(c_|w_|h_|f_|q_|g_|ar_|dpr_|e_)/;

function isTransformSegment(segment: string): boolean {
  return segment.includes(",") || TRANSFORM_TOKENS.test(segment);
}

function withCloudinaryTransforms(
  src: string,
  width: number,
  quality: number,
): string {
  const markerIndex = src.indexOf(UPLOAD_SEGMENT);
  if (markerIndex === -1) return src;

  const prefix = src.slice(0, markerIndex + UPLOAD_SEGMENT.length);
  const suffix = src.slice(markerIndex + UPLOAD_SEGMENT.length);
  const slashIndex = suffix.indexOf("/");

  if (slashIndex === -1) {
    if (isTransformSegment(suffix)) return src;
    return `${prefix}f_auto,q_${quality},w_${width}/${suffix}`;
  }

  const firstSegment = suffix.slice(0, slashIndex);
  const rest = suffix.slice(slashIndex + 1);

  if (isTransformSegment(firstSegment)) {
    const updatedSegment = firstSegment.includes("w_")
      ? firstSegment.replace(/w_\d+/, `w_${width}`)
      : `${firstSegment},w_${width}`;
    return `${prefix}${updatedSegment}/${rest}`;
  }

  return `${prefix}f_auto,q_${quality},w_${width}/${suffix}`;
}

function withUnsplashTransforms(
  src: string,
  width: number,
  quality: number,
): string {
  const base = src.split("?")[0];
  return `${base}?w=${width}&q=${quality}&auto=format&fit=crop`;
}

/** Next.js custom image loader — Cloudinary/Unsplash URLs with CDN sizing; local paths unchanged. */
export default function imageLoader({
  src,
  width,
  quality = 75,
}: LoaderProps): string {
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  if (src.includes(CLOUDINARY_HOST)) {
    return withCloudinaryTransforms(src, width, quality);
  }

  if (src.includes("images.unsplash.com")) {
    return withUnsplashTransforms(src, width, quality);
  }

  return src;
}
