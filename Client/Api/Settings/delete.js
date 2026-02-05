
const DELETE_ACCOUNT_URL = "http://localhost:5000/api/v1/user/delete/permanent";

export const deleteAccount = async () => {
  try {
    const response = await fetch(DELETE_ACCOUNT_URL, {
      method: "DELETE",
      credentials: "include",

    });

    const data = await response.json();
    if (!data.ok) throw new Error("Internal Server Error");

    return {
      ok: response.ok,
      status: response.status,
      message: data.message,
    };
  } catch (err) {
    console.log(err);
  }
};
