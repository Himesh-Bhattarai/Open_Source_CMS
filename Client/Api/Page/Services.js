const CHECK_SLUG_AVAILABILITY_URL = "http://localhost:5000/api/v1/check-slug/slug"

export const checkSlugAvailability = async (slug, tenantId) => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/v1/check-slug/slug?slug=${slug}&tenantId=${tenantId}`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            available: data.available,
            message: data.message
        };

    } catch (err) {
        console.error(err);
        return { ok: false, available: false };
    }
};
