const REGISTER_URL = process.env.NEXT_PUBLIC_REGISTER_URL;

// Register Api call
export const registerApi = async (data) => {

  if (!data) {
    throw new Error("No data provided");
  }

  try {

    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Register API RESPONSE:", response)
    if (!response.ok) throw new Error(result.message || "Registration failed");

    return {
      ok: response.ok,
      status: response.status,
      data: result
    }
  } catch (err) {
    return {
      ok: false,
      status: err.status || 500,
      message: err.message || "An error occurred during registration"
    }
  }


};
