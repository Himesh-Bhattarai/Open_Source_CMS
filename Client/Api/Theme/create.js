const CREATE_THEME_URL = "http://localhost:5000/api/v1/create-theme/theme";

export const createTheme = async (data) => {
  console.log("WHat is the structure of data", data);
  try {
    const response = await fetch(CREATE_THEME_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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
