const GET_TENANTS_URL = "http://localhost:5000/api/v1/tenants/get-tenant";
const GET_ALL_BLOG_URL = "http://localhost:5000/api/v1/blog/get-blogs";
const GET_MEDIA_URL = "http://localhost:5000/api/v1/media/get-media";
const GET_PAGE_URL = "http://localhost:5000/api/v1/page/get-page";

//tenant fetch
export const getUserTenants = async () => {
  const response = await fetch(GET_TENANTS_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

//fetch all user Admin panel

export const fetchAllUser = async () => {
  const response = await fetch(GET_TENANTS_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.json();
};

//fetch all blog
export const fetchAllBlog = async () => {
  const response = await fetch("http://localhost:5000/api/v1/blog/get-blogs", {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.json();
};

//fetch all media data
export const fetchMedia = async () => {
  const response = await fetch("http://localhost:5000/api/v1/media/get-media", {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.json();
};
