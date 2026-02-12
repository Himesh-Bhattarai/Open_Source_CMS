const DELETE_SEO_BY_ID = process.env.NEXT_PUBLIC_DELETE_SEO_BY_ID;


//Delete Seo by id
export const deleteSeoById = async (seoId) => {
  try {
    const response = await fetch(`${DELETE_SEO_BY_ID}/${seoId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const json = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: json,
    };
  } catch (err) {
    console.error("deleteSeoById failed:", err);
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }
};
