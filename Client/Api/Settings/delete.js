const DELETE_ACCOUNT_URL = process.env.NEXT_PUBLIC_DELETE_ACCOUNT_URL;

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
    return {
      ok: false,
      status: 500,
      message: err?.message || "Network error",
    };
  }
};
