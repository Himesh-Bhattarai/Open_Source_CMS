import { BlogPost as Blog } from "../Models/Blog/Blogpost.js";

export const getBlog = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    const slug = req.params?.slug;

    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    if (slug) {
      const post = await Blog.findOne({
        tenantId,
        slug: String(slug),
        status: "published",
      }).lean();

      if (!post) {
        return res.status(404).json({ error: "Blog not found" });
      }

      return res.status(200).json({ blog: post });
    }

    const limit = Math.min(Number(req.query?.limit) || 20, 100);
    const offset = Math.max(Number(req.query?.offset) || 0, 0);

    const posts = await Blog.find({
      tenantId,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    return res.status(200).json({
      blogs: posts,
      total: posts.length,
      limit,
      offset,
      hasMore: posts.length === limit,
    });
  } catch (err) {
    next(err);
  }
};
