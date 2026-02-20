import { BlogPost } from "../../Models/Blog/Blogpost.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

export const updateBlog = async (req, res, next) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      const err = new Error("Unauthorized: user not found");
      err.statusCode = 401;
      throw err;
    }

    if (!blogId) {
      const err = new Error("Missing blogId in params");
      err.statusCode = 400;
      throw err;
    }

    const blogData = req.body;

    // Optional: Prevent changing tenantId or authorId
    delete blogData.tenantId;
    delete blogData.authorId;

    // Find and update the blog
    const updatedBlog = await BlogPost.findOneAndUpdate({ _id: blogId, authorId: userId }, blogData, {
      new: true, // return the updated document
      runValidators: true, // enforce schema rules
    });

    if (!updatedBlog) {
      const err = new Error("Blog post not found");
      err.statusCode = 404;
      throw err;
    }

    log.info(`Blog post updated by user: ${userId}, blogId: ${blogId}`);

    notif.updateBlog({
      userId: userId,
      slug: updatedBlog.slug || "",
      title : updatedBlog.title || "",
      blogId: blogId,
      websiteId: updatedBlog.tenantId
    })

    res.status(200).json({
      ok: true,
      blog: updatedBlog,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    log.error(err);
    next(err);
  }
};
