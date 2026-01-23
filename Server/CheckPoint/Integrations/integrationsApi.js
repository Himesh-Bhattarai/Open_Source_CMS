import {Tenant} from "../../Models/Tenant/Tenant.js";
import {Page} from "../../Models/Page/Page.js";
import {Seo} from "../../Models/Seo/Seo.js";
import {Menu} from "../../Models/Menu/Menu.js";
import {Footer} from "../../Models/Footer/Footer.js";
import {BlogPost} from "../../Models/Blog/Blogpost.js";
import {Form} from "../../Models/Form/Form.js";
import {Theme} from "../../Models/Theme/Theme.js";
import {Media} from "../../Models/Media/Media.js";

export const integrationsApi = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId) throw new Error("Unauthorized");

        const tenants = await Tenant.find({ userId });
        if (!tenants.length) throw new Error("No tenants found");

        const response = [];

        for (const tenant of tenants) {
            const apis = [];
            const domain = tenant.domain;

            // ---------- PAGES ----------
            const pages = await Page.find({ tenantId: tenant._id }).select("slug");
            if (pages.length) {
                apis.push(`/api/v1/${domain}/pages`);
                pages.forEach(p => {
                    if (p.slug) {
                        apis.push(`/api/v1/${domain}/pages/${p.slug}`);
                    }
                });
            }

            // ---------- BLOGS ----------
            const blogs = await BlogPost.find({ tenantId: tenant._id }).select("slug");
            if (blogs.length) {
                apis.push(`/api/v1/${domain}/blogs`);
                blogs.forEach(b => {
                    if (b.slug) {
                        apis.push(`/api/v1/${domain}/blogs/${b.slug}`);
                    }
                });
            }

            // ---------- SINGLE INSTANCE FEATURES ----------
            if (await Seo.exists({ tenantId: tenant._id }))
                apis.push(`/api/v1/${domain}/seo`);

            if (await Menu.exists({ tenantId: tenant._id }))
                apis.push(`/api/v1/${domain}/menu`);

            if (await Footer.exists({ tenantId: tenant._id }))
                apis.push(`/api/v1/${domain}/footer`);

            if (await Form.exists({ tenantId: tenant._id }))
                apis.push(`/api/v1/${domain}/form`);

            if (await Theme.exists({ tenantId: tenant._id }))
                apis.push(`/api/v1/${domain}/theme`);

            if (await Media.exists({ tenantId: tenant._id }))
                apis.push(`/api/v1/${domain}/media`);

            response.push({
                tenantId: tenant._id,
                domain,
                apis
            });
        }

        res.json({ success: true, data: response });

    } catch (err) {
        next(err);
    }
};
