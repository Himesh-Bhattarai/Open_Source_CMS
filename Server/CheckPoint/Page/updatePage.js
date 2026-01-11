import crypto from "crypto"
import { Page } from "../../Models/Page/Page.js"

export const updatePagePhase2 = async (req, res) => {
    const { pageId } = req.params;
    const { data, etag } = req.body;
    const userId = req.user?.userId;

    const page = await Page.findById(pageId)

    if (!page) {
        return res.status(404).json({ message: "Page not found" })
    }

    // 🔐 Version lock
    if (etag !== page.etag) {
        return res.status(409).json({
            message: "This page was updated by another user. Reload required."
        })
    }

    // ============================
    // SEO — MERGE (never overwrite Phase-1 fields)
    // ============================

    page.seo = {
        ...page.seo,                 // keeps noIndex, keywords
        metaTitle: data.seo.metaTitle,
        metaDescription: data.seo.metaDescription,
        canonicalUrl: data.seo.canonicalUrl,
        og: data.seo.openGraph,
        twitter: data.seo.twitter,
        structuredData: normalizeStructuredData(data.seo.structuredData)
    }

    // ============================
    // SETTINGS — safe overwrite
    // ============================

    page.settings = {
        ...page.settings,
        ...data.settings
    }

    // ============================
    // STATUS
    // ============================

    page.status = data.status
    page.publishedAt = data.publishedAt || page.publishedAt

    // ============================
    // Bump version
    // ============================

    page.etag = crypto.randomUUID()
    await page.save()

    res.json({
        success: true,
        etag: page.etag,
        updatedAt: page.updatedAt
    })
}

function normalizeStructuredData(sd) {
    if (!sd || typeof sd !== "object") return {}

    return {
        "@context": sd["@context"] || "https://schema.org",
        "@type": sd["@type"] || "WebPage",
        ...sd
    }
}

