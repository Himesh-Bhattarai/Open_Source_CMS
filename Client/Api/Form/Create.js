const CREATE_FORM_URL = "http://localhost:5000/api/v1/create-form/form";
const UPDATE_FORM_URL = "http://localhost:5000/api/v1/update-form/form";

export const createForm = async (data) => {
  console.log("What is the data Structure ", data);
  try {
    const response = await fetch(CREATE_FORM_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await response.json();
    if (response.ok)
      return {
        ok: response.ok,
        status: response.status,
        data: request,
      };
  } catch (err) {
    console.error(err);
  }
};



export const updateForm = async (data, formId) => {
  try {
    const response = await fetch(`${UPDATE_FORM_URL}/${formId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      message: json.message,
      data: json.data, // 🔥 UNWRAP HERE
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
