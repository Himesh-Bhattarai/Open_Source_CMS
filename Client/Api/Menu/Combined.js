const MENU_URL = "http://localhost:5000/api/v1/create-menu/menu";
const MENU_ITEM_URL = "http://localhost:5000/api/v1/create-menu/menu-item";
const UPDATE_MENU_URL = "http://localhost:5000/api/v1/update-menu/menus";
export const createMenu = async (data) => {
  try {
    const response = await fetch(MENU_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await response.json();

    return {
      ok: response.ok,
      menuId: request.menuId,
      ...request,
    };
  } catch (err) {
    console.error(err);
  }
};

export const createMenuItem = async (data) => {
  try {
    const response = await fetch(MENU_ITEM_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    //debug response
    console.log(response, "Did i get MenuItem Response?");
    return response.json();
  } catch (err) {
    console.error(err);
  }
};


export const updateMenu = async(menuId, data)=>{
  try{
    console.log(menuId, data, "Updating Menu with Id and Data");
    const response = await fetch(`${UPDATE_MENU_URL}/${menuId}`,{
      method: "PUT",
      credentials: "include",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const request = await response.json();
    return{
      ok: response.ok,
      status: response.status,
      ...request,
    }
  }catch(err){
    console.error(err);
  }
}
