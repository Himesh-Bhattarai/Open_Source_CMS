const BLOG_CREATE_URL = "http://localhost:5000/api/v1/create-blog/blog";

export const blogPostApi = async (blogData) => {
  const response = await fetch(BLOG_CREATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(blogData),
  });

  return response.json();
};
