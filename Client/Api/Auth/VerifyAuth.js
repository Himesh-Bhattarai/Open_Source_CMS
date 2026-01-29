const VERIFY_ME = process.env.NEXT_PUBLIC_VERIFY_ME;



//Verify user when login
export const verifyMe = async () => {
  const response = await fetch(VERIFY_ME, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Not authenticated");
  }

  return response.json();
};
