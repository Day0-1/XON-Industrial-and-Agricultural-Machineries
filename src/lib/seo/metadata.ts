import type { Metadata } from "next";
import {
  defaultSocialImage,
  getSiteUrl,
  resolveSiteImageUrl,
  siteConfig,
} from "./site";
import {
  getDefaultOpenGraphImages,
  getDefaultTwitterMetadata,
} from "./social";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  noIndex?: boolean;
};

function normalizeImage(image?: string): string | undefined {
  const trimmed = image?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function resolveImageUrl(image?: string): string {
  const normalized = normalizeImage(image);
  if (!normalized) {
    return defaultSocialImage.path;
  }
  if (normalized.startsWith("http")) {
    return normalized;
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export function buildPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    path = "",
    image,
    imageAlt,
    imageWidth,
    imageHeight,
    noIndex = false,
  } = options;

  const url = `${getSiteUrl()}${path}`;
  const shareImage = normalizeImage(image);
  const imagePath = resolveImageUrl(shareImage);
  const pageTitle = title ?? siteConfig.name;
  const openGraphTitle = title
    ? `${title} | ${siteConfig.shortName}`
    : siteConfig.name;

  const ogImages = shareImage
    ? [
        {
          url: resolveSiteImageUrl(imagePath),
          width: imageWidth ?? defaultSocialImage.width,
          height: imageHeight ?? defaultSocialImage.height,
          alt: imageAlt ?? openGraphTitle,
        },
      ]
    : getDefaultOpenGraphImages(imageAlt ?? openGraphTitle);

  const twitterImage = shareImage
    ? resolveSiteImageUrl(imagePath)
    : defaultSocialImage.path;

  return {
    title: title ? title : undefined,
    description,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.shortName,
      title: openGraphTitle,
      description,
      images: ogImages,
    },
    twitter: getDefaultTwitterMetadata({
      title: openGraphTitle,
      description,
      imageUrl: twitterImage,
    }),
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
