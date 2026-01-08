const CREATE_MEDIA_URL = "http://localhost:5000/api/v1/create-media/media";

export const createMedia = async (data) => {
    try {
        console.log("What is the data Structure", data);
        const response = await fetch(CREATE_MEDIA_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            //media

        });

        const request = await response.json();
        if (response.ok) return {
            ok: response.ok,
            status: response.status,
            data: request
        }
    } catch (err) {
        console.error(err);
    }
}