const FETCH_SEO_URL = "http://localhost:5000/api/v1/seo/load-seo/get-seo-settings";

export const fetchSeo = async () => {
  const response = await fetch(FETCH_SEO_URL, {
    method: "GET",
    credentials: "include",
  });

  const json = await response.json();
  console.log("Response", json);

  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch SEO");
  }

  return json.data ?? json;
};

