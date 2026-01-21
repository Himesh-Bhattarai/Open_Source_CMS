const DELETE_TENANT_URL = "http://localhost:5000/api/v1/delete/delete-tanent"

//delete tanent by id
export const deleteTenantById = async (tenantId) => {
    try {
        //debug 
        console.log("Tenant iD", tenantId);
        const response = await fetch(`${DELETE_TENANT_URL}/${tenantId}`, {
            method: "DELETE",
            credentials: "include"
        });

        const request = await response.json();
        if (!response.ok) throw new Error("Internal Server Error")
        return {
            ok: response.ok,
            status: response.ok,
            data: request.data
        }
    }catch(err){
        console.log(err);
        return{
            ok: false,
            status: response.status,
            message: "Internal server may error"
        }
    }
}



