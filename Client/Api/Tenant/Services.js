const DELETE_TENANT_BY_ID = process.env.NEXT_PUBLIC_DELETE_TENANT_BY_ID;
const DELETE_ALL_TENANTS =
  process.env.NEXT_PUBLIC_DELETE_ALL_TENANTS;
const EDIT_TENANT_BY_ID = process.env.NEXT_PUBLIC_EDIT_TENANT_BY_ID;


//delete tenant by id
export const deleteTenantById = async (tenantId) => {
  const response = await fetch(`${DELETE_TENANT_BY_ID}/${tenantId}`, {
    method: "DELETE",
    credentials: "include",
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || "Delete failed");
  }

  return {
    ok: true,
    status: response.status,
    data,
  };
};

//delete all tenants (ADMIN)
export const deleteAllTenants = async () => {
  try {
    const response = await fetch(DELETE_ALL_TENANTS, {
      method: "DELETE",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) throw new Error(request?.message || "Delete all failed");
    return {
      ok: response.ok,
      status: response.status,
      data: request,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 500, data: null };
  }
};


//edit tenant
export const editTenantById = async (tenantId, data) => {
  try {
    const response = await fetch(`${EDIT_TENANT_BY_ID}/${tenantId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const request = await response.json();

    if (!response.ok) throw new Error(request?.message || "Tenant update failed");
    return {
      ok: response.ok,
      status: response.status,
      data: request.data,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, status: 500, data: null };
  }
};
