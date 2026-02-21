const NOTIFY_GET = process.env.NEXT_PUBLIC_NOTIFY_GET;
const NOTIFY_BASE = (NOTIFY_GET || "").replace(/\/get-notification$/, "");

//get notification
export const getNotification = async () => {
  try {
    const response = await fetch(NOTIFY_GET, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) throw new Error("Internal Server Error");

    return {
      ok: response.ok,
      status: response.status,
      data: data?.data || data || [],
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      message: "Network Error",
      data: [],
    };
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const response = await fetch(`${NOTIFY_BASE}/read/${notificationId}`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      message: data?.message || response.statusText,
      data: data?.notification || null,
    };
  } catch (err) {
    return { ok: false, status: 500, message: "Network Error", data: null };
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const response = await fetch(`${NOTIFY_BASE}/read-all`, {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      message: data?.message || response.statusText,
    };
  } catch (err) {
    return { ok: false, status: 500, message: "Network Error" };
  }
};

export const deleteNotificationById = async (notificationId) => {
  try {
    const response = await fetch(`${NOTIFY_BASE}/${notificationId}`, {
      method: "DELETE",
      credentials: "include",
    });
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      message: data?.message || response.statusText,
    };
  } catch (err) {
    return { ok: false, status: 500, message: "Network Error" };
  }
};
