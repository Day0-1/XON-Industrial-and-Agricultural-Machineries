import type { Metadata } from "next";
import { getSiteUrl, siteConfig } from "./site";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

function resolveImageUrl(image?: string): string {
  if (!image) {
    return `${getSiteUrl()}/opengraph-image`;
  }
  if (image.startsWith("http")) {
    return image;
  }
  return `${getSiteUrl()}${image.startsWith("/") ? image : `/${image}`}`;
}

export function buildPageMetadata(options: PageMetadataOptions = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    path = "",
    image,
    imageAlt,
    noIndex = false,
  } = options;

  const url = `${getSiteUrl()}${path}`;
  const ogImage = resolveImageUrl(image);
  const pageTitle = title ?? siteConfig.name;
  const openGraphTitle = title
    ? `${title} | ${siteConfig.shortName}`
    : siteConfig.name;

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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt ?? openGraphTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: openGraphTitle,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle
        ? { creator: siteConfig.twitterHandle }
        : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
