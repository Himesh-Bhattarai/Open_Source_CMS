"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchSeo } from "@/Api/Seo/Fetch";
import { deleteSeoById } from "@/Api/Seo/Delete";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import { MoreVertical, Edit, Trash2, Eye, Globe, FileText } from "lucide-react";

export default function SeoOverview() {
    const [seoList, setSeoList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const loadSeo = async () => {
            try {
                const data = await fetchSeo();
                setSeoList(Array.isArray(data) ? data : [data]);
            } catch (err) {
                console.error(err);
                setSeoList([]);
            } finally {
                setLoading(false);
            }
        };

        loadSeo();
    }, []);

    //delete Seo
    const deleteSeo = async (id: string) => {
        try {
            setLoading(true);
            setMessage(null);

            const response = await deleteSeoById(id);

            if (!response?.ok) {
                throw new Error("Delete failed");
            }

            setSeoList((prev) => prev.filter((seo) => seo._id !== id));

            setMessage("SEO deleted successfully");

            setTimeout(() => {
                router.push("/cms/global/seo");
            }, 1000);
        } catch (err) {
            console.error(err);
            setMessage("Failed to delete SEO");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-sm text-muted-foreground">Loading SEO…</div>;
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">SEO</h1>
                    <p className="text-sm text-muted-foreground">
                        Search engine visibility & metadata
                    </p>
                </div>

                {/* ALWAYS AVAILABLE */}
                <Button asChild>
                    <Link href="/cms/global/seo/new">+ Create SEO</Link>
                </Button>
            </div>

            {/* CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {seoList.map((seo) => {
                    const isPage = seo.scope === "page";

                    return (
                        <Card key={seo._id} className="relative">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div className="space-y-1">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        {isPage ? (
                                            <FileText className="h-4 w-4" />
                                        ) : (
                                            <Globe className="h-4 w-4" />
                                        )}
                                        {isPage ? "Page SEO" : "Global SEO"}
                                    </CardTitle>

                                    <Badge
                                        variant={isPage ? "secondary" : "default"}
                                        className="w-fit"
                                    >
                                        {isPage ? "Page-level" : "Site-wide"}
                                    </Badge>
                                </div>

                                {/* THREE DOT MENU */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Eye className="h-4 w-4 mr-2" />
                                            Preview
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                            <Link href={`/cms/global/seo/new/${seo._id}`}>
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => deleteSeo(seo._id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>

                            <CardContent className="space-y-3 text-sm">
                                {/* TITLE */}
                                <div>
                                    <div className="text-xs text-muted-foreground">Title</div>
                                    <div className="font-medium truncate">
                                        {seo.pageSEO?.title ||
                                            seo.globalSEO?.general?.siteTitle ||
                                            "Not set"}
                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                <div>
                                    <div className="text-xs text-muted-foreground">
                                        Meta description
                                    </div>
                                    <div className="line-clamp-2 text-muted-foreground">
                                        {seo.pageSEO?.metaDescription ||
                                            seo.globalSEO?.general?.metaDescription ||
                                            "Not set"}
                                    </div>
                                </div>

                                {/* EXTRA CONTEXT */}
                                {isPage && (
                                    <div className="text-xs text-muted-foreground">
                                        Page ID: {seo.pageId}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
