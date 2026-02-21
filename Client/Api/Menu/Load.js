const LOAD_MENU_URL = process.env.NEXT_PUBLIC_LOAD_MENU_URL;
const LOAD_MENU_BY_ID = process.env.NEXT_PUBLIC_LOAD_MENU_BY_ID;

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//load menus
export const loadMenus = async () => {
  try {
    if (!LOAD_MENU_URL) {
      throw new Error("Load menu API URL is not configured");
    }
    const response = await fetch(LOAD_MENU_URL, {
      credentials: "include",
      method: "GET",
    });

    const request = await parseJsonSafe(response);
    if (!response.ok) throw new Error(request?.message || "Failed to load menus");
    return {
      ok: response.ok,
      menus: Array.isArray(request?.menus) ? request.menus : [],
    };
  } catch (err) {
    console.error(err);
    return { ok: false, menus: [] };
  }
};

//get particular menu
export const loadMenuById = async (menuId) => {
  try {
    if (!LOAD_MENU_BY_ID) {
      throw new Error("Load menu by id API URL is not configured");
    }
    const response = await fetch(`${LOAD_MENU_BY_ID}/${menuId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await parseJsonSafe(response);
    if (!response.ok) throw new Error(request?.message || "Failed to load menu");
    const resolvedMenu = request?.menu || request || null;
    return {
      ok: response.ok,
      menu: resolvedMenu,
      ...(typeof request === "object" && request ? request : {}),
    };
  } catch (err) {
    console.error(err);
    return { ok: false, menu: null };
  }
};
