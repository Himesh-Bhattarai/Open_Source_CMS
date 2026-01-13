const DELETE_MENU_ITEM = "http://localhost:5000/api/v1/delete-menu/menus";
const DELETE_MENU_BY_ID = "http://localhost:5000/api/v1/delete-menu/menu";

export const deleteMenuById = async (menuId) => {
  try {
    const response = await fetch(`${DELETE_MENU_BY_ID}/${menuId}`,{
      method: "DELETE",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok)
      throw new Error(request.message || "Internal Server Error");
    return {
      ok: response.ok,
      status: response.status,
      ...request,
    };
  } catch (err) {
    console.error(err);
  }
};

export const deleteMenu = async () => {
  try {
    const response = await fetch(DELETE_MENU_ITEM,{
      method: "DELETE",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok)
      throw new Error(request.message || "Internal Server Error");
    return {
      ok: response.ok,
      status: response.status,
      ...request,
    };
  } catch (err) {
    console.error(err);
  }
};
