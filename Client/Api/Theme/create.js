const CREATE_THEME_URL = process.env.NEXT_PUBLIC_CREATE_THEME_URL;

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const createTheme = async (data) => {
  try {
    if (!CREATE_THEME_URL) {
      return {
        ok: false,
        status: 500,
        message: "Theme API URL is not configured",
        data: null,
      };
    }

    const response = await fetch(CREATE_THEME_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await parseJsonSafe(response);
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: request?.message || "Failed to save theme",
        data: request || null,
      };
    }

    return {
      ok: true,
      status: response.status,
      message: request?.message || "Theme saved",
      data: request || null,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: "Network error while saving theme",
      data: null,
    };
  }
};

export const fetchThemeSetting = async (websiteId) => {
  try {
    if (!CREATE_THEME_URL) {
      return {
        ok: false,
        status: 500,
        message: "Theme API URL is not configured",
        data: null,
      };
    }
    if (!websiteId) {
      return {
        ok: false,
        status: 400,
        message: "websiteId is required",
        data: null,
      };
    }

    const response = await fetch(`${CREATE_THEME_URL}/${websiteId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const request = await parseJsonSafe(response);
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: request?.message || "Failed to load theme",
        data: request || null,
      };
    }

    return {
      ok: true,
      status: response.status,
      message: request?.message || "Theme loaded",
      data: request || null,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: "Network error while loading theme",
      data: null,
    };
  }
};
