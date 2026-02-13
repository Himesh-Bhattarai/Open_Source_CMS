const GET_TENANTS_URL = process.env.NEXT_PUBLIC_GET_TENANTS_URL;
const GET_ALL_BLOG_URL = process.env.NEXT_PUBLIC_GET_ALL_BLOG_URL;
const GET_MEDIA_URL = process.env.NEXT_PUBLIC_GET_MEDIA_URL;
const GET_PAGE_URL = process.env.NEXT_PUBLIC_GET_PAGE_URL;
const FETCH_ALL_BLOG = process.env.NEXT_PUBLIC_FETCH_ALL_BLOG;
const FETCH_ALL_MEDIA = process.env.NEXT_PUBLIC_FETCH_ALL_MEDIA;
const FETCH_ALL_PAGE = process.env.NEXT_PUBLIC_FETCH_ALL_PAGE;
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
  const response = await fetch(FETCH_ALL_BLOG, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.json();
};

//fetch all media data
export const fetchMedia = async () => {
  const response = await fetch(FETCH_ALL_MEDIA, {
    credentials: "include",
    method: "GET",
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.json();
};
