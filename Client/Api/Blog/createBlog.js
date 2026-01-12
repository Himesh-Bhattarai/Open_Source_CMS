const BLOG_CREATE_URL = "http://localhost:5000/api/v1/create-blog/blog";
const UPDATE_BLOG_URL = "http://localhost:5000/api/v1/blog/update-blog";

export const blogPostApi = async (blogData, tenantId) => {
  console.log("Creating blog with data:", blogData, "and tenantId:", tenantId);
  const response = await fetch(BLOG_CREATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({blogData, tenantId }),
  });

  return response.json();
};

export const updateBlogApi = async (blogId, blogData) => {
  try {
    const response = await fetch(`${UPDATE_BLOG_URL}/${blogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(blogData),
    });

    const request = response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.log(err);
    const error = new Error(`HTTP error! status: ${response.status}`);
  }
};
