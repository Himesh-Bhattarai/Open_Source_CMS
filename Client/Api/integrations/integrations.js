const INTEGRATIONS_URL = "http://localhost:5000/api/v1/integrations/get-api";

export const integrationsApi = async()=>{
    try{
        const response = await fetch(`${INTEGRATIONS_URL}`,{
            method: "GET",
            credentials: "include",

        });

        const data = response.json();

        if(!data.ok) throw new Error(data.message || "Failed to fetch integrations");

        return{
            ok: response.ok,
            status: response.status,
            data: data.data
        }
    }catch(err){
        console.error(err);
    }
}