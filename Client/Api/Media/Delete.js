const DELETE_MEDIA_URL_BASE =
  process.env.NEXT_PUBLIC_DELETE_MEDIA_URL || "http://localhost:5000/api/v1/media/media";

const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const deleteMediaById = async (mediaId) => {
  try {
    if (!mediaId) {
      throw new Error("Media ID is required");
    }

    const response = await fetch(`${DELETE_MEDIA_URL_BASE}/${mediaId}`, {
      method: "DELETE",
      credentials: "include",
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
