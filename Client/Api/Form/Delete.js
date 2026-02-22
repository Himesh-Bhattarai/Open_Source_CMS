const DELETE_FORM_BY_ID = process.env.NEXT_PUBLIC_DELETE_FORM_BY_ID;

//delete form  by id
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
