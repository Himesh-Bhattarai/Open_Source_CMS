const CREATE_MEDIA_URL = process.env.NEXT_PUBLIC_CREATE_MEDIA_URL;

const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//create media
export const createMedia = async (data) => {
  try {
    if (!CREATE_MEDIA_URL) {
      throw new Error("NEXT_PUBLIC_CREATE_MEDIA_URL is not configured");
    }

    const response = await fetch(CREATE_MEDIA_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await safeParseJson(response);
    return {
      ok: response.ok,
      status: response.status,
      message: request?.message || response.statusText,
      data: request?.data ?? request,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: err?.message || "Network error",
      data: null,
    };
  }
};
