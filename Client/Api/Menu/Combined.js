const MENU_URL =
  process.env.NEXT_PUBLIC_CREATE_MENU_URL ||
  process.env.NEXT_PUBLIC_MENU_URL;
const MENU_ITEM_URL = process.env.NEXT_PUBLIC_CREATE_MENU_ITEM_URL;
const UPDATE_MENU_URL = process.env.NEXT_PUBLIC_UPDATE_MENU_URL;

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};


//create menu
export const createMenu = async (data) => {
  try {
    if (!MENU_URL) {
      return {
        ok: false,
        status: 500,
        message:
          "Create menu API URL is missing (NEXT_PUBLIC_CREATE_MENU_URL or NEXT_PUBLIC_MENU_URL)",
      };
    }

    const response = await fetch(MENU_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await parseJsonSafe(response);
    const resolvedMenuId =
      request?.menuId || request?._id || request?.data?.menuId || request?.data?._id;

    return {
      ...request,
      ok: response.ok,
      status: response.status,
      menuId: resolvedMenuId,
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: "Network error while creating menu",
    };
  }
};


//this may not be using but , create menu item
export const createMenuItem = async (data) => {
  try {
    if (!MENU_ITEM_URL) {
      return { ok: false, status: 500, message: "Menu item API URL not configured" };
    }
    const response = await fetch(MENU_ITEM_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await parseJsonSafe(response);
    return {
      ok: response.ok,
      status: response.status,
      ...request,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 500, message: "Network error while creating menu item" };
  }
};


//update menu
export const updateMenu = async (menuId, data) => {
  try {
    if (!UPDATE_MENU_URL) {
      return { ok: false, status: 500, message: "Update menu API URL not configured" };
    }
    const response = await fetch(`${UPDATE_MENU_URL}/${menuId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await parseJsonSafe(response);
    return {
      ok: response.ok,
      status: response.status,
      ...request,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 500, message: "Network error while updating menu" };
  }
};
