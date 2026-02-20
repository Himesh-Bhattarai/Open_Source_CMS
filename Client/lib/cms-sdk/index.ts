/**
 * ContentFlow CMS SDK
 *
 * Reusable client library for integrating with ContentFlow CMS APIs
 * Can be used in any React/Next.js application
 */

export interface CMSConfig {
  baseUrl: string;
  tenant: string;
  apiKey: string;
  cacheTime?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  type: "internal" | "external" | "dropdown";
  url: string;
  order: number;
  enabled: boolean;
  children?: MenuItem[];
}

export interface MenuResponse {
  id: string;
  location: string;
  tenant: string;
  items: MenuItem[];
  lastModified: string;
  publishedAt: string;
}

export interface FooterBlock {
  id: string;
  type: "logo" | "menu" | "social" | "newsletter" | "text";
  column: number;
  order: number;
  data: any;
}

export interface FooterResponse {
  id: string;
  tenant: string;
  layout: string;
  blocks: FooterBlock[];
  bottomBar: {
    copyright: string;
    legalLinks: Array<{ label: string; url: string }>;
  };
  lastModified: string;
  publishedAt: string;
}

export interface PageBlock {
  id: string;
  type: string;
  order: number;
  data: any;
}

export interface PageResponse {
  id: string;
  tenant: string;
  slug: string;
  title: string;
  metaDescription: string;
  blocks: PageBlock[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    canonical: string;
  };
  publishedAt: string;
  lastModified: string;
}

export interface BlogPost {
  id: string;
  tenant: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  publishedAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  posts: BlogPost[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ThemeResponse {
  id: string;
  tenant: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    accent: string;
  };
  typography: {
    fontFamily: {
      heading: string;
      body: string;
    };
    fontSize: {
      base: string;
      h1: string;
      h2: string;
      h3: string;
      h4: string;
    };
  };
  layout: {
    containerWidth: string;
    spacing: string;
    borderRadius: string;
  };
  header: {
    style: string;
    position: string;
    logo: {
      url: string;
      height: string;
    };
  };
  footer: {
    style: string;
    columns: number;
  };
  updatedAt: string;
}

export class ContentFlowCMS {
  private config: Required<CMSConfig>;

  constructor(config: CMSConfig) {
    this.config = {
      ...config,
      cacheTime: config.cacheTime ?? 60,
    };
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.baseUrl}/api/v1/external-request/${this.config.tenant}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        "X-API-Key": this.config.apiKey,
        "Content-Type": "application/json",
        ...options?.headers,
      },
      next: {
        revalidate: this.config.cacheTime,
        ...options?.next,
      },
    });

    if (!response.ok) {
      throw new Error(
        `CMS API Error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  // Menu APIs
  async getMenu(location = "header"): Promise<MenuResponse> {
    return this.fetch<MenuResponse>(`/menu?location=${location}`);
  }

  // Footer APIs
  async getFooter(): Promise<FooterResponse> {
    return this.fetch<FooterResponse>("/footer");
  }

  // Page APIs
  async getPage(slug: string): Promise<PageResponse> {
    return this.fetch<PageResponse>(`/pages/${slug}`);
  }

  // Blog APIs
  async getBlogPosts(params?: {
    limit?: number;
    offset?: number;
    category?: string;
    tag?: string;
  }): Promise<BlogResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.tag) queryParams.append("tag", params.tag);

    const query = queryParams.toString();
    return this.fetch<BlogResponse>(`/blog${query ? `?${query}` : ""}`);
  }

  async getBlogPost(slug: string): Promise<BlogPost> {
    return this.fetch<BlogPost>(`/blog/${slug}`);
  }

  // Theme APIs
  async getTheme(): Promise<ThemeResponse> {
    return this.fetch<ThemeResponse>("/theme");
  }
}

// Factory function for easy initialization
export function createCMSClient(config: CMSConfig): ContentFlowCMS {
  return new ContentFlowCMS(config);
}
