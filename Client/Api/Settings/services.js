
const VALIDATE_USER = process.env.NEXT_PUBLIC_VALIDATE_USER;
const FEEDBACK_COLLECT = process.env.NEXT_PUBLIC_FEEDBACK_COLLECT;
const CHANGE_PASSWORD = process.env.NEXT_PUBLIC_CHANGE_PASSWORD;
const GET_API_KEYS = process.env.NEXT_PUBLIC_GET_API_KEYS;

const resolveApiKeysUrl = () => {
  if (!GET_API_KEYS) return "/api/v1/api-keys/get-keys";
  return GET_API_KEYS.replace("/api-keys/user/get-keys", "/api-keys/get-keys");
};
export const validateUser = async (par1, par2) => {
  try {
    if (!VALIDATE_USER) throw new Error("VALIDATE_USER URL is not configured");
    const response = await fetch(VALIDATE_USER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ par1, par2 }),
    });

    const data = await response.json();
    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || "Validation failed");
    }

    return {
      ok: true,
      status: response.status,
      message: data.message,
      shouting: data.shouting,
    };
  } catch (err) {
    return {
      ok: false,
      message: err?.message || "Network error",
      status: 500,
      shouting: false,
    };
  }
};


export const feedbackCollector = async (payload) => {
  try {
    if (!FEEDBACK_COLLECT) throw new Error("FEEDBACK_COLLECT URL is not configured");
    const response = await fetch(FEEDBACK_COLLECT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || "Internal Server Error");
    }
    return {
      ok: true,
      status: response.status,
      data: data.data || [],
      message: data?.message || "Feedback submitted",
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: err?.message || "Network error",
      data: [],
    };
  }
};


//Change password

export const changePassword = async (payload) => {
  try {
    if (!CHANGE_PASSWORD) throw new Error("CHANGE_PASSWORD URL is not configured");
    const response = await fetch(CHANGE_PASSWORD, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || "Internal server error");
    }

    return {
      ok: true,
      status: response.status,
      message: data.message,
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: err?.message || "Network error",
    };
  }
};


//get api keys
export const getApiKeys = async () => {
  try {
    const response = await fetch(resolveApiKeysUrl(), {
      credentials: "include",
      method: "GET",
    });

    const data = await response.json();
    if (!response.ok || !data?.ok) {
      throw new Error(data?.message || "Internal server error");
    }

    return {
      ok: true,
      status: response.status,
      data: Array.isArray(data.data) ? data.data : [],
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: err?.message || "Network error",
      data: [],
    };
  }
};
