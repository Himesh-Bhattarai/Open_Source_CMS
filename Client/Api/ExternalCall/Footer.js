const DEFAULT_TENANT = process.env.NEXT_PUBLIC_DEFAULT_TENANT_DOMAIN || "";

// Fetch footer via internal server route to avoid exposing API keys in browser code.
export const fetchFooter = async (tenant = DEFAULT_TENANT) => {
  try {
    const query = tenant ? `?tenant=${encodeURIComponent(tenant)}` : "";
    const response = await fetch(`/api/public/footer${query}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.message || "Failed to load footer");

    return {
      ok: true,
      data: data?.data || null,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      data: null,
    };
  }
};
