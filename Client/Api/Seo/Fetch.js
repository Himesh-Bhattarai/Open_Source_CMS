const FETCH_SEO_URL = process.env.NEXT_PUBLIC_FETCH_SEO_URL;
const LOAD_SEO_BY_ID = process.env.NEXT_PUBLIC_LOAD_SEO_BY_ID;

//Fetch Seo
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

//Fetch Seo
export const fetchSeoById = async (seoId) => {
  try {
    const response = await fetch(`${LOAD_SEO_BY_ID}/${seoId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error("fetchSeoById failed:", err);
    throw err;
  }
};
