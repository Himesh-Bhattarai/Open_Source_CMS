const NOTIFY_GET = "http://localhost:5000/api/v1/notifications/get-notification";


//get notification
export const getNotification = async () => {
  try {
    const response = await fetch(NOTIFY_GET,{
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
