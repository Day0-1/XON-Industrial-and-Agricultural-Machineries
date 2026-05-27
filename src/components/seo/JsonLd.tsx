import {
  getContactEmail,
  getContactPhone,
  getSocialLinks,
} from "@/lib/site/contact";
import { defaultSocialImage, getSiteUrl, resolveSiteImageUrl, siteConfig } from "@/lib/seo/site";

export function OrganizationJsonLd() {
  const phone = getContactPhone();
  const email = getContactEmail();
  const sameAs = getSocialLinks().map((link) => link.href);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: getSiteUrl(),
    logo: resolveSiteImageUrl("/logo.png"),
    image: resolveSiteImageUrl(defaultSocialImage.path),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: phone,
        email,
        contactType: "customer service",
        areaServed: "NG",
        availableLanguage: ["English"],
      },
    ],
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const siteUrl = getSiteUrl();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.shortName,
    url: siteUrl,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: resolveSiteImageUrl("/logo.png"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
