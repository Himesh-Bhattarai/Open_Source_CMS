const BACKUP_BASE_URL =
  process.env.NEXT_PUBLIC_BACKUP_BASE_URL || "http://localhost:5000/api/v1/backup";

const safeParse = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BACKUP_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
  });
  const payload = await safeParse(response);
  return {
    ok: response.ok,
    status: response.status,
    message: payload?.message || response.statusText,
    data: payload?.data ?? payload,
    count: payload?.count ?? 0,
  };
};

export const getBackups = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return request(`/list${suffix}`);
};

export const createBackup = async (data) =>
  request("/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const restoreBackup = async (data) =>
  request("/restore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const downloadBackup = async (backupId) => {
  try {
    const response = await fetch(`${BACKUP_BASE_URL}/download/${backupId}`, {
      method: "GET",
      credentials: "include",
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      const payload = contentType.includes("application/json")
        ? await safeParse(response)
        : null;
      return {
        ok: false,
        status: response.status,
        message: payload?.message || response.statusText || "Download failed",
        data: null,
      };
    }

    const disposition = response.headers.get("content-disposition") || "";
    const filenameMatch = disposition.match(/filename=\"?([^\";]+)\"?/i);
    const filename = filenameMatch?.[1] || `backup_${backupId}.json`;
    const blob = await response.blob();

    return {
      ok: true,
      status: response.status,
      message: "Backup downloaded",
      data: { blob, filename },
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      status: 500,
      message: error?.message || "Network error",
      data: null,
    };
  }
};

export const getBackupSettings = async (tenantId = "") => {
  const suffix = tenantId ? `?tenantId=${tenantId}` : "";
  return request(`/settings${suffix}`);
};

export const saveBackupSettings = async (data) =>
  request("/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
