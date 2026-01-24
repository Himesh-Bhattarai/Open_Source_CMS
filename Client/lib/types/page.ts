// First, let's create shared types in a separate file (types/page.ts)
// This ensures type safety across components

export type PageStatus = "draft" | "published" | "scheduled" | "archived";
export type PageType = "default" | "landing" | "blog" | "system";
export type Visibility = "public" | "private" | "auth-only";
export type Environment = "production" | "staging" | "development";

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;

  // Extended SEO fields
  canonicalUrl?: string;
  robots: {
    index: boolean;
    follow: boolean;
    maxImagePreview?: "none" | "standard" | "large";
    maxSnippet?: number;
    maxVideoPreview?: number;
  };
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article" | "profile" | "book" | "music" | "video";
  };
  twitter?: {
    card?: "summary" | "summary_large_image" | "app" | "player";
    title?: string;
    description?: string;
    image?: string;
    site?: string;
  };
  structuredData?: Record<string, any>;
  sitemapInclusion: boolean;
  noIndexReasons?: string[]; // Track why page might be noindex
}

export interface PageBlock {
  id: string;
  type: string;
  order: number;
  data: Record<string, any>;
  schemaVersion: string;
  validationErrors?: string[];
  // Future-proof: allow any additional data
  [key: string]: any;
}

export interface PageVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  data: any;
  createdAt: Date;
  createdBy: string;
  changes: string[];
  autoSave?: boolean;
}

export interface PageSettings {
  featured: boolean;
  allowComments: boolean;
  template: string;

  // New production fields
  pageType: PageType;
  visibility: Visibility;
  locked?: {
    byUserId: string;
    lockedAt: Date;
    expiresAt: Date;
    sessionId?: string;
  };
  authorId: string;
  parentId?: string;
  redirectFrom?: string[]; // Track previous slugs for 301 redirects
  isHomepage?: boolean;
  order?: number;
  publishedVersionId?: string;
}

export interface Page {
  _id: string;
  tenantId: string;
  title: string;
  slug: string;
  content: string; // Legacy content field (keep for backward compatibility)
  blocks: PageBlock[];
  status: PageStatus;
  publishedAt?: string;
  author: string;
  authorId: string;
  seo: SEOData;
  settings: PageSettings;

  // New production fields
  slugHistory: Array<{
    slug: string;
    changedAt: Date;
    changedBy: string;
    redirectEnabled: boolean;
  }>;
  currentVersion: number;
  versions: PageVersion[];
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;

  // Locking mechanism
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: Date;

  // For conflict detection
  etag: string;
  lastSavedHash: string;

  //i dont know what is that suggested by chatGPT so to get rid of warning i added this
  affectedPages?: string[];
}

// Block schema definitions for validation
export const BLOCK_SCHEMAS = {
  hero: {
    fields: ["heading", "subheading", "backgroundImage", "ctaText", "ctaLink"],
    required: ["heading"],
    maxNesting: 0,
  },
  text: {
    fields: ["heading", "body", "alignment", "textSize"],
    required: ["body"],
    maxNesting: 2, // Allow nested blocks within text
  },
  features: {
    fields: ["title", "items"],
    required: ["items"],
    itemsSchema: {
      title: "string",
      description: "string",
      icon: "string",
    },
  },
  gallery: {
    fields: ["images", "layout", "captions"],
    required: ["images"],
    itemsSchema: {
      url: "string",
      alt: "string",
      title: "string",
    },
  },
  cta: {
    fields: ["heading", "subheading", "button"],
    required: ["button"],
    buttonSchema: {
      label: "string",
      href: "string",
      variant: "string",
    },
  },
  testimonials: {
    fields: ["testimonials"],
    required: ["testimonials"],
    itemsSchema: {
      quote: "string",
      author: "string",
      role: "string",
    },
  },
  team: {
    fields: ["members"],
    required: ["members"],
    itemsSchema: {
      name: "string",
      role: "string",
      bio: "string",
      image: "string",
    },
  },
  contact: {
    fields: ["email", "phone", "formFields"],
    required: [],
    formFieldsSchema: {
      name: "string",
      type: "string",
      required: "boolean",
    },
  },
  custom: {
    fields: ["type", "config"],
    required: ["type"],
    // Custom blocks can have any structure
    allowAnyFields: true,
  },
} as const;

// Type guard for block types
export type BlockType = keyof typeof BLOCK_SCHEMAS;
export type PageContent = Page;
