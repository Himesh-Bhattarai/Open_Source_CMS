const UPDATE_SEO_URL = process.env.NEXT_PUBLIC_UPDATE_SEO_URL;

const CREATE_SEO_URL = process.env.NEXT_PUBLIC_CREATE_SEO_URL;


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
