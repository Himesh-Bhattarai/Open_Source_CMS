const LOAD_FORMS_DATA = process.env.NEXT_PUBLIC_LOAD_FORMS_DATA;
const LOAD_FORMS_DATA_BY_ID = process.env.NEXT_PUBLIC_LOAD_FORMS_DATA_BY_ID;


//load form data
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


//load particular form
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
