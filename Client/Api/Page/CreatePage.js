const CREATE_PAGE_URL = process.env.NEXT_PUBLIC_CREATE_PAGE_URL;
const UPDATE_PAGE_URL =
  process.env.NEXT_PUBLIC_UPDATE_PAGE_URL ||
  process.env.NEXT_PUBLIC_UPDATA_PAGE_URL;
const CREATE_PAGE_VERSION = process.env.NEXT_PUBLIC_CREATE_PAGE_VERSION;


  //Create Page
export const createPage = async (data) => {
  if (!data) throw new Error("No data Provided");

  const response = await fetch(CREATE_PAGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  return response.json();
};


//Create Page v1
export const createPageVersion = async (data) => {
  try {
    const response = await fetch(CREATE_PAGE_VERSION, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await response.json();
    if (!response.ok) throw new Error(request.message);
    return request;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

//Update Page
export const updatePage = async (pageId, { data, etag, options }) => {

  // http://localhost:3000/api/v1/update-page/page/:pageId
  const normalizedPageId = String(pageId ?? "").trim();
  if (!normalizedPageId || normalizedPageId === "undefined" || normalizedPageId === "null") {
    const err = new Error("Invalid pageId for update");
    err.status = 400;
    throw err;
  }

  const baseUrl = String(UPDATE_PAGE_URL ?? "")
    .replace(/\/+$/, "")
    .replace(/\/undefined$/, "")
    .replace(/\/null$/, "");

  if (!baseUrl) {
    const err = new Error("Update page API URL is missing (NEXT_PUBLIC_UPDATE_PAGE_URL)");
    err.status = 500;
    throw err;
  }

  const response = await fetch(`${baseUrl}/${normalizedPageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ data, etag, options }),
  });

  const result = await response.json();

  if (!response.ok) {
    const err = new Error(result.message || "Update failed");
    err.status = response.status;
    throw err;
  }

  return result;
};
