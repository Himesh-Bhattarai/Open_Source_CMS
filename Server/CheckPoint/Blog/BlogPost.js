import { BlogPost } from "../../Models/Blog/Blogpost.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js"
export const BlogPostCheckpoint = async (req, res, next) => {
  try {
    const { blogData } = req.body;
    const userId = req.user?.userId;

    if (!blogData || !userId) {
      return res.status(400).json({ message: "Missing blogData" });
    }

    const { tenantId, title, slug, excerpt, category, status } = blogData;

    if (!tenantId) {
      return res.status(400).json({ message: "tenantId missing" });
    }

    const blogPost = await BlogPost.create({
      tenantId,
      authorId: userId,
      title,
      slug,
      excerpt,
      category,
      status,
      content: "",
      featuredImage: null,
      tags: [],
      seo: {
        metaTitle: "",
        metaDescription: "",
        focusKeyword: "",
      },
      settings: {
        featured: false,
        allowComments: true,
        showAuthor: true,
      },
    });

    res.status(201).json({ blogId: blogPost._id });
  } catch (err) {
    next(err);
  }
};
