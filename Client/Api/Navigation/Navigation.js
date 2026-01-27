const CMS_MENU_API = "http://localhost:5000/api/v1/external-request/www.salonCheckInSystem.com/menu";

export const fetchMenu = async ()=>{
    try{
        const response = await fetch(CMS_MENU_API, {
            method: "GET"
        });

        const data = await response.json();

        if(!data.ok) throw new Error("Internal Server Error");
        console.log("Is nav giving me data", data);

        return{
            ok: response.ok,
            data: data?.data
        }
    }catch(err){
        console.error(err);
        return{
            ok: false,
            data: []
        }
    }
}