"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Eye, Trash2, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import {fetchFooter } from "@/Api/Footer/Fetch"
import { deleteFooterById } from "@/Api/Footer/Delete"
import { toast } from "sonner"

export default function FooterPage() {
    const [loading, setLoading] = useState(false)
    const [footers, setFooters] = useState<any[]>([])

    const truncate = (text = "", length = 50) =>
        text.length > length ? text.slice(0, length) + "..." : text

    /* ---------------- LOAD FOOTERS ---------------- */
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)

                const response = await fetchFooter()

                if (!response?.ok) {
                    const serverMessage =
                        response?.data?.message || response?.data?.error || ""
                    if (
                        typeof serverMessage === "string" &&
                        serverMessage.toLowerCase().includes("footer not found")
                    ) {
                        setFooters([])
                        return
                    }
                    throw new Error(serverMessage || "Failed to load footers")
                }
                const footersArray = Array.isArray(response.data)
                    ? response.data
                    : response.data
                        ? [response.data]
                        : []

                setFooters(footersArray)

            } catch (err: any) {
                console.error("Footer load skipped:", err?.message || err)
                setFooters([])
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])


    /* ---------------- DELETE FOOTER ---------------- */
    const deleteFooter = async (footerId: string) => {
        const previous = footers
        setFooters((prev) => prev.filter((f) => f._id !== footerId))

        try {
            const response = await deleteFooterById(footerId)
            if (!response?.ok) throw new Error("Delete failed")
            toast.success("Footer deleted")
        } catch (err: any) {
            setFooters(previous)
            toast.error(err.message || "Failed to delete footer")
        }
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-balance text-3xl font-bold tracking-tight">Footers</h1>
                    <p className="text-pretty text-muted-foreground mt-1">
                        Manage global site footers
                    </p>
                </div>
                <Button asChild>
                    <Link href="/cms/global/footer/new">
                        <Plus className="h-4 w-4 mr-2" />
                        New Footer
                    </Link>
                </Button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-12 text-muted-foreground">
                    Loading footers...
                </div>
            )}

            {/* Empty */}
            {!loading && footers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    No footers found
                </div>
            )}

            {/* Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {footers.map((footer) => (
                    <Card key={footer._id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg">
                                        {footer.layout || "Footer"}
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        {truncate(footer.bottomBar?.copyrightText || "")}
                                    </CardDescription>
                                </div>

                                <Badge
                                    variant={footer.status === "published" ? "default" : "secondary"}
                                >
                                    {footer.status || "draft"}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Last edited {footer.updatedAt || "-"}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button asChild variant="outline" size="sm" className="flex-1">
                                    <Link href={`/cms/global/footer/new?footerId=${footer._id}`}>

                                        <Edit className="h-3.5 w-3.5 mr-1" />
                                        Edit
                                    </Link>
                                </Button>

                                <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                    Preview
                                </Button>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-destructive"
                                    onClick={() => deleteFooter(footer._id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
