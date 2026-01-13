const LOAD_MENU_URL = "http://localhost:5000/api/v1/load-menu/menus";
const LOAD_MENU_BY_ID = "http://localhost:5000/api/v1/load-menu/menu";
export const loadMenus = async()=>{
    try{
        const response = await fetch(LOAD_MENU_URL,{
            credentials: "include",
            method: "GET",
        })

        const request = await response.json();
        if(!response.ok) throw new Error(request.message);
        return{
            ok: response.ok,
            menus: request.menus,
        }
    }catch(err){
        console.error(err);
    }
}

export const loadMenuById = async(menuId)=>{
    try{
        const response = await fetch(`${LOAD_MENU_BY_ID}/${menuId}`,{
            method: "GET",
            credentials: "include",

        });

        const request = await response.json();
        if(!response.ok) throw new Error(request.message);
        return{
            ok: response.ok,
            menu: request.menu,
            ...request,
        }
    }catch(err){
        console.error(err);
    }
}