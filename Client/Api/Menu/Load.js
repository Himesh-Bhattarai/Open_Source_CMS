const LOAD_MENU_URL = process.env.NEXT_PUBLIC_LOAD_MENU_URL;  
const LOAD_MENU_BY_ID = process.env.NEXT_PUBLIC_LOAD_MENU_BY_ID;

//load menus
export const loadMenus = async () => {
  try {
    const response = await fetch(LOAD_MENU_URL, {
      credentials: "include",
      method: "GET",
    });

    const request = await response.json();
    if (!response.ok) throw new Error(request.message);
    return {
      ok: response.ok,
      menus: request.menus,
    };
  } catch (err) {
    console.error(err);
  }
};


//get particular menu
export const loadMenuById = async (menuId) => {
  try {
    const response = await fetch(`${LOAD_MENU_BY_ID}/${menuId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) throw new Error(request.message);
    return {
      ok: response.ok,
      menu: request.menu,
      ...request,
    };
  } catch (err) {
    console.error(err);
  }
};
