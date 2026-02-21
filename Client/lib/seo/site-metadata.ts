import type { Metadata } from "next";

const DEFAULT_SITE_URL = "https://contentflow.com";

const normalizeUrl = (value?: string) => {
  if (!value) return undefined;
  try {
    return new URL(value).toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
};

const SITE_URL =
  normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
  normalizeUrl(process.env.CMS_PUBLIC_SITE_ORIGIN) ||
  DEFAULT_SITE_URL;

const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "@contentflow";

export const siteMetadataConfig = {
  name: "ContentFlow",
  title: "ContentFlow CMS",
  description:
    "ContentFlow is a multi-tenant content management system for teams building and managing websites without heavy engineering overhead.",
  siteUrl: SITE_URL,
  twitterHandle: TWITTER_HANDLE,
  defaultOgImage: "/fav/favicon-32x32.png",
};

const resolveCanonical = (path?: string) => {
  if (!path || path === "/") return siteMetadataConfig.siteUrl;
  return new URL(path.startsWith("/") ? path : `/${path}`, `${siteMetadataConfig.siteUrl}/`).toString();
};

const resolveAbsoluteImage = (image?: string) => {
  if (!image) {
    return new URL(siteMetadataConfig.defaultOgImage, `${siteMetadataConfig.siteUrl}/`).toString();
  }
  try {
    return new URL(image).toString();
  } catch {
    return new URL(image.startsWith("/") ? image : `/${image}`, `${siteMetadataConfig.siteUrl}/`).toString();
  }
};

type CreatePageMetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  image?: string;
};

export const createPageMetadata = ({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  type = "website",
  image,
}: CreatePageMetadataInput): Metadata => {
  const canonical = resolveCanonical(path);
  const ogImage = resolveAbsoluteImage(image);

  return {
    title,
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: siteMetadataConfig.name,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: siteMetadataConfig.twitterHandle,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
        },
  };
};
