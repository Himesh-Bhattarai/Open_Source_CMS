const LOAD_FORMS_DATA = "http://localhost:5000/api/v1/form/get-form";
const LOAD_FORMS_DATA_BY_ID = "http://localhost:5000/api/v1/form/get-form";
export const loadFormsData = async () => {
  try {
    const response = await fetch(LOAD_FORMS_DATA, {
      credentials: "include",
      method: "GET",
    });

    const request = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: request.data ?? request,
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

export const loadFormsDataById = async (formId) => {
  try {
    const response = await fetch(`${LOAD_FORMS_DATA_BY_ID}/${formId}`, {
      credentials: "include",
      method: "GET",
    });

    const request = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      message: response.statusText || "Form Loaded Successfully",
      data: request,
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
