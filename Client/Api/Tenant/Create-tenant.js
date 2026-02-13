const CREATE_TENANT_URL = process.env.NEXT_PUBLIC_CREATE_TENANT_URL;


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
