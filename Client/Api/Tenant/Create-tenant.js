const CREATE_TENANT_URL = "http://localhost:5000/api/v1/create-tenant/tenant";


//create tenant
export const createTenant = async (data) => {
  const response = await fetch(CREATE_TENANT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const request = await response.json();
  return request;
};
