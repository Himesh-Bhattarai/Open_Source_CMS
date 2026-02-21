const REGISTER_URL = process.env.NEXT_PUBLIC_REGISTER_URL;

// Register Api call
export const registerApi = async (data) => {
  if (!data) {
    throw new Error("No data provided");
  }

  const response = await fetch(REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
