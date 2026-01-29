const LOAD_TENANTS_URL = "http://localhost:5000/api/v1/tenants/get-tenant";
const LOAD_TENANTS_BY_ID =
  "http://localhost:5000/api/v1/tenants/get-selcted-tenant";
const GET_ALL_TENANTS_URL = "http://localhost:5000/api/v1/tenants/all-tenants";

//Get user tenants (ALL TENANTS)
export const getUserTenants = async () => {
  const response = await fetch(LOAD_TENANTS_URL, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

//Get user tenants By ID
export const getUserTenantsById = async (tenantId) => {
  try {
    const response = await fetch(`${LOAD_TENANTS_BY_ID}/${tenantId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (response.ok)
      return {
        ok: response.ok,
        status: response.status,
        data: request,
      };
  } catch (err) {
    console.error(err);
  }
};

//For ADMIN GET ALL TENANTS

export const getAllTenants = async () => {
  try {
    const response = await fetch(GET_ALL_TENANTS_URL, {
      method: "GET",
      credential: "include",
    });

    const request = await response.json();
    if (response.ok)
      return {
        ok: response.ok,
        status: response.status,
        data: request,
      };
  } catch (err) {
    console.error(err);
  }
};

export const deleteTenant = async (tenantId) => {
 
};
