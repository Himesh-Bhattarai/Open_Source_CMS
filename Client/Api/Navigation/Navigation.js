const CMS_MENU_API = "http://localhost:5000/api/v1/external-request/contentFlow.com/menu";

export const fetchMenu = async ()=>{
    try{
        const response = await fetch(CMS_MENU_API, {
            method: "GET",
            headers: {
                Authorization: "Bearer 5df6f0394cb54ff74c0519f04b311be2c3e9b01d10f28ec95f2892a0c7237665"
            }
        });

        const data = await response.json();
        console.log("Is nav giving me data", data);

        if(!response.ok) throw new Error("Internal Server Error");
        return{
            ok: response.ok,
            data: data?.getMenu
        }
    }catch(err){
        console.error(err);
        return{
            ok: false,
            data: []
        }
    }
}