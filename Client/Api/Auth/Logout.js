const LOGOUT_URL = process.env.NEXT_PUBLIC_LOGOUT_URL;

export const logoutApi = async () => {
  if (!LOGOUT_URL) throw new Error("LOGOUT_URL is undefined");

  const response = await fetch(LOGOUT_URL, {
    method: "POST",
    credentials: "include",
  });

  const request = await response.json();
  return request;
};
