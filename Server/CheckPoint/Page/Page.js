import { Page } from "../../Models/Page/Page.js";
import crypto from "crypto"

export const pageCheckpoint = async (req, res) => {
    const { title, slug, pageTree, seo, tenantId } = req.body
    const userId = req.user.userId

    const page = await Page.create({
        tenantId,
        title,
        slug,
        pageTree,
        seo: {
            keywords: seo.keywords,
            noIndex: seo.noIndex
        },
        authorId: userId,
        etag: crypto.randomUUID()
    })

    res.json({ pageId: page._id })
}
