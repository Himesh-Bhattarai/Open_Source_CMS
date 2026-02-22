const CREATE_FORM_URL = process.env.NEXT_PUBLIC_CREATE_FORM_URL;
const UPDATE_FORM_URL = process.env.NEXT_PUBLIC_UPDATE_FORM_URL;

const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//create Contact or any kind of form
export const createForm = async (data) => {
  try {
    if (!CREATE_FORM_URL) {
      throw new Error("NEXT_PUBLIC_CREATE_FORM_URL is not configured");
    }

    const response = await fetch(CREATE_FORM_URL, {
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

//update form

export const updateForm = async (data, formId) => {
  try {
    if (!UPDATE_FORM_URL) {
      throw new Error("NEXT_PUBLIC_UPDATE_FORM_URL is not configured");
    }
    if (!formId) {
      throw new Error("Form ID is required");
    }

    const response = await fetch(`${UPDATE_FORM_URL}/${formId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await safeParseJson(response);

    return {
      ok: response.ok,
      status: response.status,
      message: json?.message || response.statusText,
      data: json?.data ?? json,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: "Network error",
      data: null,
    };
  }
};
