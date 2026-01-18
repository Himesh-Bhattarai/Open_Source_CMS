const FETCH_SEO_URL = "http://localhost:5000/api/v1/seo/load-seo/get-seo-settings";
const LOAD_SEO_BY_ID = "http://localhost:5000/api/v1/seo/load-seo/get-seo-settings";

export const fetchSeo = async () => {
  const response = await fetch(FETCH_SEO_URL, {
    method: "GET",
    credentials: "include",
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Failed to fetch SEO");
  }

  return json.data ?? json;
};




export const fetchSeoById = async (seoId) => {
  try {
    const response = await fetch(`${LOAD_SEO_BY_ID}/${seoId}`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (err) {
    console.error("fetchSeoById failed:", err)
    throw err 
  }
}
