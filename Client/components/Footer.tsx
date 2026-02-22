// components/Footer.tsx
"use client";

import Link from "next/link";

interface FooterLink {
  id: string;
  label: string;
  slug: string;
}

interface FooterTextBlock {
  id: string;
  type: "text";
  data: {
    title?: string;
    content?: string;
  };
}

interface FooterMenuBlock {
  id: string;
  type: "menu";
  data: {
    title?: string;
    links?: FooterLink[];
  };
}

type FooterBlock = FooterTextBlock | FooterMenuBlock | { id: string; type: string; data?: unknown };

export interface FooterData {
  layout?: string;
  blocks?: FooterBlock[];
  bottomBar?: {
    copyrightText?: string;
    socialLinks?: Array<Record<string, unknown>>;
  };
}

export default function Footer({ footer }: { footer: FooterData | null }) {
  if (!footer) return null;

  const blocks = Array.isArray(footer.blocks) ? footer.blocks : [];
  const brandBlock = blocks.find(
    (block): block is FooterTextBlock => block.type === "text" && typeof block.data === "object",
  );
  const menuBlocks = blocks.filter(
    (block): block is FooterMenuBlock => block.type === "menu" && typeof block.data === "object",
  );

  return (
    <footer className="py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          {brandBlock && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CF</span>
                </div>
                <span className="font-bold text-lg">{brandBlock.data.title || "ContentFlow"}</span>
              </div>

              <p className="text-sm text-muted-foreground">{brandBlock.data.content}</p>
            </div>
          )}

          {/* Menus */}
          {menuBlocks.map((menu) => (
            <div key={menu.id}>
              <h4 className="font-semibold mb-4">{menu.data.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {(menu.data.links || []).map((link) => (
                  <li key={link.id}>
                    <Link href={link.slug} className="hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          {footer.bottomBar?.copyrightText || ""}
        </div>
      </div>
    </footer>
  );
}
