const FETCH_SEO_URL = "http://localhost:3000/api/v1/seo/get-seo-settings";

const fetchSeo = async () => {
  const response = await fetch(FETCH_SEO_URL, {
    method: "GET",
    credentials: "include",
  });

  const request = await response.json();
  if (response.ok)
    return {
      ok: response.ok,
      status: response.status,
      data: request,
    };
};
