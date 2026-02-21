const FOOTER_URL = process.env.NEXT_PUBLIC_FOOTER_URL;
const UPDATE_FOOTER_URL = process.env.NEXT_PUBLIC_UPDATE_FOOTER_URL;

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const createFooter = async (data) => {
  try {
    if (!FOOTER_URL) {
      return {
        ok: false,
        status: 500,
        message: "Footer create API URL is not configured",
        data: null,
      };
    }

    const response = await fetch(FOOTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const request = await parseJsonSafe(response);
    return {
      ok: response.ok,
      status: response.status,
      message:
        request?.message ||
        (response.ok ? "Footer created successfully" : "Failed to create footer"),
      data: request,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: error instanceof Error ? error.message : "Network error",
      data: null,
    };
  }
};

export const updateFooter = async (id, data) => {
  try {
    if (!UPDATE_FOOTER_URL) {
      return {
        ok: false,
        status: 500,
        message: "Footer update API URL is not configured",
        data: null,
      };
    }
    if (!id) {
      return {
        ok: false,
        status: 400,
        message: "Footer ID is required",
        data: null,
      };
    }

    const response = await fetch(`${UPDATE_FOOTER_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const request = await parseJsonSafe(response);
    return {
      ok: response.ok,
      status: response.status,
      message:
        request?.message ||
        (response.ok ? "Footer updated successfully" : "Failed to update footer"),
      data: request,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: error instanceof Error ? error.message : "Network error",
      data: null,
    };
  }
};
