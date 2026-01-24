import { BlogCategory } from "../../Models/Blog/BlogCategory.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const BlogCategoryCheckpoint = async (req, res, next) => {
  try {
    const { userId, tenantId, name, slug, description, postCount } = req.body;

    if (!userId || !tenantId) {
      const err = new Error("Missing required fields");
      err.statusCode = 400;
      throw err;
    }

    log.info(`Blog Category Creation Attempt by: ${userId} name: ${name}`);

    const blogCategory = await BlogCategory.create({
      tenantId,
      name,
      slug,
      description,
      postCount,
    });

    log.info(
      `Blog Category created by: ${userId} name: ${name} Date: ${blogCategory.createdAt}`,
    );

    res.status(200).json({
      message: "Blog Category created successfully by " + userId,
    });
  } catch (err) {
    err.statusCode = err.statusCode || 400;
    next(err);
  }
};
