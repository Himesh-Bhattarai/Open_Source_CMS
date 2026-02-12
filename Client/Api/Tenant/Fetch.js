const LOAD_TENANTS_URL = process.env.NEXT_PUBLIC_LOAD_TENANTS_URL;
const LOAD_TENANTS_BY_ID =process.env.NEXT_PUBLIC_LOAD_TENANTS_BY_ID;
const GET_ALL_TENANTS_URL = process.env.NEXT_PUBLIC_GET_ALL_TENANTS_URL;

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
