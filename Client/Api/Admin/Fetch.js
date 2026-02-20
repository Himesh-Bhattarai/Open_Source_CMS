const GET_ALL_USER = process.env.NEXT_PUBLIC_GET_ALL_USER;


//Fetch all user : Admin panel
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(GET_ALL_USER, {
      method: "GET",
      credentials: "include",
    });
    const request = await response.json();
    if (!response.ok) throw new Error(request?.message || `HTTP error! status: ${response.status}`);
    return {
      ok: response.ok,
      status: response.status,
      message: response.statusText || "Users Fetched Successfully",
      data: Array.isArray(request?.data) ? request.data : [],
    };
  } catch (err) {
    console.error(err);
    return {
      ok: false,
      status: 500,
      message: "Network error",
      data: [],
    };
  }
};
