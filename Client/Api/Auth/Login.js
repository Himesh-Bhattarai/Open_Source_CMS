const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;

//Login Api Call
export const loginApi = async (data) => {
  if (!data) throw new Error("No data provided");

  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data: result,
  };
};
