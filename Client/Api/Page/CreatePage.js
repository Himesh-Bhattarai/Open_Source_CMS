const CREATE_PAGE_URL = "http://localhost:5000/api/v1/create-page/page";
const UPDATA_PAGE_URL = "http://localhost:5000/api/v1/update-page/page";
const CREATE_PAGE_VERSION =
  "http://localhost:5000/api/v1/create-page-version/page-version";

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

export const updatePage = async (pageId, { data, etag, options }) => {
  const response = await fetch(`${UPDATA_PAGE_URL}/${pageId}`, {
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
