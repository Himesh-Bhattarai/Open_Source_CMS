import { Tenant } from "../../Models/Tenant/Tenant.js";
import { Page } from "../../Models/Page/Page.js";
import { Seo } from "../../Models/Seo/Seo.js";
import { Menu } from "../../Models/Menu/Menu.js";
import { Footer } from "../../Models/Footer/Footer.js";
import { BlogPost } from "../../Models/Blog/Blogpost.js";
import { Form } from "../../Models/Form/Form.js";
import { Theme } from "../../Models/Theme/Theme.js";
import { Media } from "../../Models/Media/Media.js";
import { IntegrationUsage } from "../../Models/Integration/IntegrationUsage.js";

export const integrationsApi = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) throw new Error("Unauthorized");

        const tenants = await Tenant.find({ userId });
        if (!tenants.length) throw new Error("No tenants found");

        const result = [];

        for (const tenant of tenants) {
            const domain = tenant.domain;

            // Load all usage for this tenant
            const usage = await IntegrationUsage.find({ tenantId: tenant._id });

            const getEndpointStatus = (featureKey, endpointKey = "default") => {
                const record = usage.find(
                    (u) => u.featureKey === featureKey && u.endpointKey === endpointKey
                );
                if (!record) return "ready";

                const diffDays = (new Date() - record.lastCalledAt) / (1000 * 60 * 60 * 24);
                return diffDays > 7 ? "disconnected" : "connected";
            };

            const integrations = [];

            // ---------- MENU ----------
            const menuExists = await Menu.exists({ tenantId: tenant._id, status: "publish" });
            if (menuExists) {
                integrations.push({
                    id: "menu",
                    name: "Navigation Menu",
                    description: "Dynamic website menu",
                    status: getEndpointStatus("menu"),
                    endpoints: [
                        {
                            key: "default",
                            url: `/api/v1/external-request/${domain}/menu`,
                            status: getEndpointStatus("menu", "default"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "menu" && u.endpointKey === "default")
                                    ?.lastCalledAt || null,
                        },
                    ],
                });
            }

            // ---------- FOOTER ----------
            if (await Footer.exists({ tenantId: tenant._id })) {
                integrations.push({
                    id: "footer",
                    name: "Footer",
                    description: "Footer links and content",
                    status: getEndpointStatus("footer"),
                    endpoints: [
                        {
                            key: "default",
                            url: `/api/v1/external-request/${domain}/footer`,
                            status: getEndpointStatus("footer", "default"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "footer" && u.endpointKey === "default")
                                    ?.lastCalledAt || null,
                        },
                    ],
                });
            }

            // ---------- SEO ----------
            if (await Seo.exists({ tenantId: tenant._id })) {
                integrations.push({
                    id: "seo",
                    name: "SEO",
                    description: "Meta tags and SEO settings",
                    status: getEndpointStatus("seo"),
                    endpoints: [
                        {
                            key: "default",
                            url: `/api/v1/external-request/${domain}/seo`,
                            status: getEndpointStatus("seo", "default"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "seo" && u.endpointKey === "default")
                                    ?.lastCalledAt || null,
                        },
                    ],
                });
            }

            // ---------- PAGES ----------
            const pages = await Page.find({ tenantId: tenant._id }).select("slug");
            if (pages.length) {
                integrations.push({
                    id: "pages",
                    name: "Pages",
                    description: "Dynamic CMS pages",
                    status: getEndpointStatus("pages", "collection"),
                    endpoints: [
                        {
                            key: "collection",
                            url: `/api/v1/external-request/${domain}/pages`,
                            status: getEndpointStatus("pages", "collection"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "pages" && u.endpointKey === "collection")
                                    ?.lastCalledAt || null,
                        },
                        ...pages
                            .filter((p) => p.slug)
                            .map((p) => ({
                                key: `page:${p.slug}`,
                                url: `/api/v1/external-request/${domain}/pages/${p.slug}`,
                                status: getEndpointStatus("pages", `page:${p.slug}`),
                                lastCalledAt:
                                    usage.find((u) => u.featureKey === "pages" && u.endpointKey === `page:${p.slug}`)
                                        ?.lastCalledAt || null,
                            })),
                    ],
                });
            }

            // ---------- BLOG ----------
            const blogs = await BlogPost.find({ tenantId: tenant._id }).select("slug");
            if (blogs.length) {
                integrations.push({
                    id: "blog",
                    name: "Blog Posts",
                    description: "Blog content",
                    status: getEndpointStatus("blog", "collection"),
                    endpoints: [
                        {
                            key: "collection",
                            url: `/api/v1/external-request/${domain}/blogs`,
                            status: getEndpointStatus("blog", "collection"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "blog" && u.endpointKey === "collection")
                                    ?.lastCalledAt || null,
                        },
                        ...blogs
                            .filter((b) => b.slug)
                            .map((b) => ({
                                key: `post:${b.slug}`,
                                url: `/api/v1/external-request/${domain}/blogs/${b.slug}`,
                                status: getEndpointStatus("blog", `post:${b.slug}`),
                                lastCalledAt:
                                    usage.find(
                                        (u) => u.featureKey === "blog" && u.endpointKey === `post:${b.slug}`
                                    )?.lastCalledAt || null,
                            })),
                    ],
                });
            }

            // ---------- FORM ----------
            if (await Form.exists({ tenantId: tenant._id })) {
                integrations.push({
                    id: "form",
                    name: "Forms",
                    description: "Public form submissions",
                    status: getEndpointStatus("form"),
                    endpoints: [
                        {
                            key: "default",
                            url: `/api/v1/external-request/${domain}/form`,
                            status: getEndpointStatus("form", "default"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "form" && u.endpointKey === "default")
                                    ?.lastCalledAt || null,
                        },
                    ],
                });
            }

            // ---------- THEME ----------
            if (await Theme.exists({ tenantId: tenant._id })) {
                integrations.push({
                    id: "theme",
                    name: "Theme",
                    description: "Theme settings",
                    status: getEndpointStatus("theme"),
                    endpoints: [
                        {
                            key: "default",
                            url: `/api/v1/external-request/${domain}/theme`,
                            status: getEndpointStatus("theme", "default"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "theme" && u.endpointKey === "default")
                                    ?.lastCalledAt || null,
                        },
                    ],
                });
            }

            // ---------- MEDIA ----------
            if (await Media.exists({ tenantId: tenant._id })) {
                integrations.push({
                    id: "media",
                    name: "Media Library",
                    description: "Public media assets",
                    status: getEndpointStatus("media"),
                    endpoints: [
                        {
                            key: "default",
                            url: `/api/v1/external-request/${domain}/media`,
                            status: getEndpointStatus("media", "default"),
                            lastCalledAt:
                                usage.find((u) => u.featureKey === "media" && u.endpointKey === "default")
                                    ?.lastCalledAt || null,
                        },
                    ],
                });
            }

            result.push({
                tenantId: tenant._id,
                domain,
                integrations,
            });
        }

        res.status(200).json({ ok: true, status: 200, message: "Success", data: result });
    } catch (err) {
        next(err);
    }
};
