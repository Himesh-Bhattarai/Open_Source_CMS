const INTEGRATIONS_URL = process.env.NEXT_PUBLIC_INTEGRATIONS_URL;

//load all available integrations or api from backend
export const integrationsApi = async () => {
  try {
    const response = await fetch(INTEGRATIONS_URL, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!data.ok)
      throw new Error(data.message || "Failed to fetch integrations");

    return {
      ok: response.ok,
      status: response.status,
      data: data.data || [],
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 500, data: [], message: err.message };
  }
};
