// components/Footer.tsx
"use client"

import Link from "next/link"

export default function Footer({ footer }: { footer: any }) {
    if (!footer) return null

    const brandBlock = footer.blocks.find((b: any) => b.type === "text")
    const menuBlocks = footer.blocks.filter((b: any) => b.type === "menu")

    return (
        <footer className="py-12 border-t">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">

                    {/* Brand */}
                    {brandBlock && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 rounded-lg bg-linear-to-br from-primary to-primary/60 flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                        CF
                                    </span>
                                </div>
                                <span className="font-bold text-lg">
                                    {brandBlock.data.title}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground">
                                {brandBlock.data.content}
                            </p>
                        </div>
                    )}

                    {/* Menus */}
                    {menuBlocks.map((menu: any) => (
                        <div key={menu.id}>
                            <h4 className="font-semibold mb-4">{menu.data.title}</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                {menu.data.links.map((link: any) => (
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
                    {footer.bottomBar.copyrightText}
                </div>
            </div>
        </footer>
    )
}
