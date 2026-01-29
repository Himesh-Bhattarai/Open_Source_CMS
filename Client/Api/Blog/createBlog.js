const BLOG_CREATE_URL = "http://localhost:5000/api/v1/create-blog/blog";
const UPDATE_BLOG_URL = "http://localhost:5000/api/v1/blog/update-blog";


//First step of create Blog
export const blogPostApi = async (blogData, tenantId) => {
  const response = await fetch(BLOG_CREATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ blogData, tenantId }),
  });

  return response.json();
};


//second Step of create blog it work as both create and update
//first create blog then same blog is update at the time of create, if need to update then it will update
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

    const request = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.error(err);
    const error = new Error(`HTTP error! status: ${response.status}`);
  }
};
