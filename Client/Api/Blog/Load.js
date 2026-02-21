const ALL_BLOG_LOAD_API = process.env.NEXT_PUBLIC_ALL_BLOG_LOAD_API;
const BLOG_LOAD_BY_ID_API = process.env.NEXT_PUBLIC_BLOG_LOAD_BY_ID_API;

//Load all Blogs for user
export const loadAllBlogs = async () => {
  try {
    if (!ALL_BLOG_LOAD_API) {
      throw new Error("NEXT_PUBLIC_ALL_BLOG_LOAD_API is not configured");
    }

    const response = await fetch(ALL_BLOG_LOAD_API, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

///specified blog load
export const loadBlogById = async (blogId) => {
  try {
    if (!BLOG_LOAD_BY_ID_API) {
      throw new Error("NEXT_PUBLIC_BLOG_LOAD_BY_ID_API is not configured");
    }
    const response = await fetch(`${BLOG_LOAD_BY_ID_API}/${blogId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
