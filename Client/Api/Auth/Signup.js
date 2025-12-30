const REGISTER_URL = process.env.NEXT_PUBLIC_REGISTER_URL;

export const registerApi = async (data) => {
    if (!REGISTER_URL) {
        throw new Error("REGISTER_URL is undefined. Check .env.local");
    }

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
