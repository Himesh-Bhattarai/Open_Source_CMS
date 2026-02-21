const LOAD_FORMS_DATA = process.env.NEXT_PUBLIC_LOAD_FORMS_DATA;
const LOAD_FORMS_DATA_BY_ID = process.env.NEXT_PUBLIC_LOAD_FORMS_DATA_BY_ID;

const safeParseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//load form data
export const loadFormsData = async () => {
  try {
    if (!LOAD_FORMS_DATA) {
      throw new Error("NEXT_PUBLIC_LOAD_FORMS_DATA is not configured");
    }

    const response = await fetch(LOAD_FORMS_DATA, {
      credentials: "include",
      method: "GET",
    });

    const request = await safeParseJson(response);

    return {
      ok: response.ok,
      status: response.status,
      message: request?.message || response.statusText,
      data: request?.data ?? request ?? [],
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: "Network error",
    };
  }
};

//load particular form
export const loadFormsDataById = async (formId) => {
  try {
    if (!LOAD_FORMS_DATA_BY_ID) {
      throw new Error("NEXT_PUBLIC_LOAD_FORMS_DATA_BY_ID is not configured");
    }
    if (!formId) {
      throw new Error("Form ID is required");
    }

    const response = await fetch(`${LOAD_FORMS_DATA_BY_ID}/${formId}`, {
      credentials: "include",
      method: "GET",
    });

    const request = await safeParseJson(response);

    return {
      ok: response.ok,
      status: response.status,
      message: request?.message || response.statusText || "Form Loaded Successfully",
      data: request ?? null,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: "Network error",
    };
  }
};
