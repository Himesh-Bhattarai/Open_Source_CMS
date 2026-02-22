const DELETE_FOOTER_BY_ID = process.env.NEXT_PUBLIC_DELETE_FOOTER_BY_ID;

//delete footer by id
export const deleteFooterById = async (footerId) => {
  try {
    const response = await fetch(`${DELETE_FOOTER_BY_ID}/${footerId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Internal server Error");
    return {
      ok: response.ok,
      status: response.status,
      message: data.message,
    };
  } catch (err) {
    console.error(err);
  }
};
