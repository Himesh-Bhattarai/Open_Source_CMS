const CREATE_SEO_URL = "http://localhost:5000/api/v1/create-seo/seo";

export const createSeo = async (data) => {
  console.log("Let me see the data Structure", data);
  const response = await fetch(CREATE_SEO_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const request = await response.json();
  console.log("What is the backend response ", request);

  if (response.ok)
    return {
      ok: response.ok,
      status: response.status,
      data: request,
    };
};


export const editSeo = (id, data) => {}