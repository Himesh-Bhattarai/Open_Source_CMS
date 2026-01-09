const LOAD_TENANTS_URL = "http://localhost:5000/api/v1/tenants/get-user-tenants";
const LOAD_TENANTS_BY_ID = "http://localhost:5000/api/v1/tenants/get-selcted-tenant";
const GET_ALL_TENANTS_URL = "http://localhost:5000/api/v1/tenants/all-tenants";

//Get user tenants (ALL TENANTS)
export const getUserTenants = async()=>{
    try{
        const response = await fetch(LOAD_TENANTS_URL,{
            method: "GET",
            credentials: "include",
        });

        const request = await response.json();
        if(response.ok) return{
            ok: response.ok,
            status: response.status,
            data: request
        }
    }catch(err){
        console.error(err);
    }
}


//Get user tenants By ID
export const getUserTenantsById = async(tenantId)=>{
    try{
        console.log("Tenant Id check", tenantId);
        const response = await fetch(`${LOAD_TENANTS_BY_ID}/${tenantId}`,{
            method: "GET",
            credentials: "include",

        });

        const request = await response.json();
        if(response.ok) return{
            ok: response.ok,
            status: response.status,
            data: request,
        }
    }catch(err){
        console.error(err);
    }
}


//For ADMIN GET ALL TENANTS 

export const getAllTenants = async()=>{
    try{
        const response = await fetch(GET_ALL_TENANTS_URL,{
            method: "GET",
            credential: "include",

        } );

        const request = await response.json();
        if(response.ok) return{
            ok: response.ok,
            status: response.status,
            data: request
        }
    }catch(err){
        console.error(err);
    }
}
