const GET_ALL_USER = "http://localhost:5000/api/v1/admin/get-all-users";


//Fetch all user : Admin panel
export const fetchAllUsers = async () => {
  try {
    const response = await fetch(GET_ALL_USER, {
      method: "GET",
      credentials: "include",
    });
    const request = await response.json();
    if (!request.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return {
      ok: response.ok,
      status: response.status,
      message: response.statusText || "Users Fetched Successfully",
      data: request.data,
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
