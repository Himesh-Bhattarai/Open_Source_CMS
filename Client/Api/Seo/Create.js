const UPDATE_SEO_URL = "http://localhost:5000/api/v1/update-seo/seo";

const CREATE_SEO_URL = "http://localhost:5000/api/v1/create-seo/seo";


//Create Seo
export const createSeo = async (data) => {
  const response = await fetch(CREATE_SEO_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const request = await response.json();
  if (response.ok)
    return {
      ok: response.ok,
      status: response.status,
      data: request,
    };
};


//Update Seo
export const updateSeo = async (seoId, data) => {
  const response = await fetch(`${UPDATE_SEO_URL}/${seoId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (response.ok) {
    return {
      ok: response.ok,
      status: response.status,
      data: json,
    };
  }

  return {
    ok: false,
    status: response.status,
    error: json?.message || "Update failed",
  };
};
