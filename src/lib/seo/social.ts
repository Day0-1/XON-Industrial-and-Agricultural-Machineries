import {
  defaultSocialImage,
  getSiteUrl,
  getTwitterHandle,
  siteConfig,
} from "./site";

export function getDefaultOpenGraphImages(alt?: string) {
  return [
    {
      url: defaultSocialImage.path,
      secureUrl: defaultSocialImage.path,
      width: defaultSocialImage.width,
      height: defaultSocialImage.height,
      alt: alt ?? defaultSocialImage.alt,
      type: "image/png",
    },
  ];
}

export function getDefaultTwitterMetadata(options: {
  title: string;
  description: string;
  imageUrl?: string;
}) {
  const image = options.imageUrl ?? defaultSocialImage.path;
  const handle = getTwitterHandle();

  return {
    card: "summary_large_image" as const,
    title: options.title,
    description: options.description,
    images: [image],
    ...(handle ? { site: handle, creator: handle } : {}),
  };
}

export function getRootSocialMetadata() {
  const title = siteConfig.name;
  const description = siteConfig.description;
  const url = getSiteUrl();

  return {
    openGraph: {
      type: "website" as const,
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.shortName,
      title,
      description,
      images: getDefaultOpenGraphImages(),
    },
    twitter: getDefaultTwitterMetadata({ title, description }),
  };
}
