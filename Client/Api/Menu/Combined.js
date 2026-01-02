const MENU_URL = "http://localhost:5000/api/v1/create-menu/menu";
const MENU_ITEM_URL = "http://localhost:5000/api/v1/create-menu/menu-item";
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

export const createMenuItem = async (data)=>{
    try{
        const response = await fetch(MENU_ITEM_URL,{
            method : "POST",
            credential: "include",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        });

        //debug response
        console.log(response, "Did i get MenuItem Response?")
        return response.json();
    }catch(err){
        console.error(err);
    }
}