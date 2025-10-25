import Head from "next/head";
import { siteConfig } from "@/lib/seo";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  keywords?: string[];
  noindex?: boolean;
  canonical?: string;
  jsonLd?: any;
  section?: string;
}

export default function SEO({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  tags = [],
  keywords = siteConfig.keywords,
  noindex = false,
  canonical,
  jsonLd,
  section,
}: SEOProps) {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const baseUrl = siteConfig.url;
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const canonicalUrl = canonical || fullUrl;
  const fullImage = image.startsWith("http") ? image : `${baseUrl}${image}`;
  const allKeywords = [...keywords, ...tags].join(", ");

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      {author && <meta name="author" content={author} />}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}
      <meta
        name="googlebot"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title || siteConfig.name} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title || siteConfig.name} />
      <meta name="twitter:creator" content="@ecast_tcioe" />
      <meta name="twitter:site" content="@ecast_tcioe" />

      {/* Additional SEO Tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta httpEquiv="content-language" content="en" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      {/* Organization Schema (on all pages) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteConfig.organization),
        }}
      />
    </Head>
  );
}
