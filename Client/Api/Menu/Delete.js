const DELETE_MENU_ITEM = process.env.NEXT_PUBLIC_DELETE_MENU_ITEM;
const DELETE_MENU_BY_ID = process.env.NEXT_PUBLIC_DELETE_MENU_BY_ID;

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//delete menu by id
export const deleteMenuById = async (menuId) => {
  try {
    const response = await fetch(`${DELETE_MENU_BY_ID}/${menuId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const request = await parseJsonSafe(response);
    if (!response.ok) throw new Error(request.message || "Internal Server Error");
    return {
      ok: response.ok,
      status: response.status,
      ...request,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 500, message: err?.message || "Failed to delete menu" };
  }
};

//delete menu all
export const deleteMenu = async () => {
  try {
    const response = await fetch(DELETE_MENU_ITEM, {
      method: "DELETE",
      credentials: "include",
    });

    const request = await parseJsonSafe(response);
    if (!response.ok) throw new Error(request.message || "Internal Server Error");
    return {
      ok: response.ok,
      status: response.status,
      ...request,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 500, message: err?.message || "Failed to delete menus" };
  }
};
