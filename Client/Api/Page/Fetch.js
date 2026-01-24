const GET_PAGE_URL = "http://localhost:5000/api/v1/page/user-pages";
const GET_PAGE_BY_ID = "http://localhost:5000/api/v1/page/selected-page";
const GET_ALL_PAGES_URL = "http://localhost:5000/api/v1/page/all-pages";
const GET_PAGES_ON_WEBSITE = "http://localhost:5000/api/v1/page/belong/website";

export const getUserPages = async () => {
  try {
    const response = await fetch(`${GET_PAGE_URL}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return request;
  } catch (err) {
    console.error(err);
  }
};

//get page based on website
export const fetchPagesByTenant = async (tenantId) => {
  try {
    const response = await fetch(`${GET_PAGES_ON_WEBSITE}/${tenantId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return request.pages;
  } catch (err) {
    console.error(err);
  }
};

//Get User page By Id
export const getPageById = async (pageId) => {
  try {
    const response = await fetch(`${GET_PAGE_BY_ID}?pageId=${pageId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    return request;
  } catch (err) {
    console.error(err);
  }
};

//For Admin Get All Pages
export const getAllPage = async () => {
  try {
    const response = await fetch(GET_ALL_PAGES_URL, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.error(err);
  }
};
