import { BlogPost as Blog } from "../Models/Blog/Blogpost.js";

export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      tenantId: req.tenant._id,
    });

    if (!blog) throw new Error("Blog not found");

    res.json({
      blog,
    });
  } catch (err) {
    next(err);
  }
};
