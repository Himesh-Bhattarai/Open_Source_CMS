const DEFAULT_TENANT = process.env.NEXT_PUBLIC_DEFAULT_TENANT_DOMAIN || "";

// Fetch menu via internal server route to avoid exposing API keys in browser code.
export const fetchMenu = async (tenant = DEFAULT_TENANT) => {
  try {
    const query = tenant ? `?tenant=${encodeURIComponent(tenant)}` : "";
    const response = await fetch(`/api/public/navigation${query}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || "Failed to load navigation");

    return {
      ok: true,
      data: Array.isArray(data?.data) ? data.data : [],
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      data: [],
    };
  }
};
