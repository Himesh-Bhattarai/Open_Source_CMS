const DELETE_FORM_BY_ID = "http://localhost:5000/api/v1/delete-form/form";

export const deleteFormById = async (formId) => {
  try {
    const response = await fetch(`${DELETE_FORM_BY_ID}/${formId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const request = response.json();

    return {
      ok: response.ok,
      status: response.status,
      message: "Form deleted successfully",
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }
};
