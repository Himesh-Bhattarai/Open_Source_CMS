const DELETE_TENANT_BY_ID = "http://localhost:5000/api/v1/tenants/delete-tenant";
const DELETE_ALL_TENANTS = "http://localhost:5000/api/v1/tenants/delete-all-tenants";
const EDIT_TENANT_BY_ID = "http://localhost:5000/api/v1/tenants/edit-tenant";


export const deleteTenantById = async (tenantId) => {
    try {
        const response = await fetch(`${DELETE_TENANT_BY_ID}/${tenantId}`, {
            method: "DELETE",
            credentials: "include"
        });

        const request = await response.json();
        if (response.ok) return {
            ok: response.ok,
            status: response.status,
            data: request
        }


    } catch (err) {
        console.error(err);
    }
}

//delete all tenants (ADMIN)
export const deleteAllTenants = async () => {
    try {
        const response = await fetch(DELETE_ALL_TENANTS, {
            method: "DELETE",
            credentials: "include"
        });

        const request = await response.json();
        if (response.ok) return {
            ok: response.ok,
            status: response.status,
            data: request
        }
    } catch (err) {
        console.error(err);
    }
}

export const editTenantById = async (tenantId, data) => {
    try {
        console.log("What is the data  Structure", data);
        const response = await fetch(`${EDIT_TENANT_BY_ID}/${tenantId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }

        );

        const request = await response.json();
        if (response.ok) return {
            ok: response.ok,
            status: response.status,
            data: request
        }
    } catch (err) {
        console.error(err);
    }
}

