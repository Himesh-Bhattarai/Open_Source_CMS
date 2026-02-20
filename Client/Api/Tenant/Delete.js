const DELETE_TENANT_URL = process.env.NEXT_PUBLIC_DELETE_TENANT_URL;

//delete tenant by id
export const deleteTenantById = async (tenantId) => {
  try {
    const response = await fetch(`${DELETE_TENANT_URL}/${tenantId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) throw new Error("Internal Server Error");
    return {
      ok: response.ok,
      status: response.status,
      data: request?.data || null,
      message: request?.message || "Tenant deleted",
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      message: err?.message || "Internal server may error",
    };
  }
};
