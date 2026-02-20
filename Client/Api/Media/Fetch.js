const LOAD_MEDIA = process.env.NEXT_PUBLIC_LOAD_MEDIA;

const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//load media
export const loadMedia = async (params = {}) => {
  try {
    if (!LOAD_MEDIA) {
      throw new Error("NEXT_PUBLIC_LOAD_MEDIA is not configured");
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, String(value));
      }
    });

    const url = query.toString() ? `${LOAD_MEDIA}?${query.toString()}` : LOAD_MEDIA;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const request = await safeParseJson(response);
    return {
      ok: response.ok,
      status: response.status,
      message: request?.message || response.statusText,
      data: request?.data ?? request ?? [],
      count: request?.count ?? 0,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: err?.message || "Network error",
      data: [],
      count: 0,
    };
  }
};
