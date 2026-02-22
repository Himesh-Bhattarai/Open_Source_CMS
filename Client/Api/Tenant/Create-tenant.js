const CREATE_TENANT_URL = process.env.NEXT_PUBLIC_CREATE_TENANT_URL;

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const createTenant = async (data) => {
  if (!CREATE_TENANT_URL) {
    return {
      ok: false,
      status: 500,
      message: "Create tenant API URL is not configured",
      data: null,
    };
  }

  const response = await fetch(CREATE_TENANT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data || {}),
  });

  const request = await parseJsonSafe(response);
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: request?.message || request?.error || "Failed to create tenant",
      data: request || null,
    };
  }

  return {
    ok: true,
    status: response.status,
    message: request?.message || "Tenant created successfully",
    apiKey: request?.apiKey || "",
    tenant: request?.tenant || null,
    data: request || null,
  };
};
