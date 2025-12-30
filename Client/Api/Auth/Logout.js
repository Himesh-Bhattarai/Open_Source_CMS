const LOGOUT_URL = process.env.frontend.LOGOUT_URL;

export const logoutApi = async (data)=>{
    try{
        if(!data) return new Error("No Required data provided");

        const response = await fetch(LOGOUT_URL, {
            method: "POST",
            "Content-Type" : "application/json",
            body: JSON.stringify(data)
        });

        const request = await response.json();
        return request;
    }catch(err){
        return err;
    }
}