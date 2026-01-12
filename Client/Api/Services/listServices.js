const CHECK_SLUG_AVAILABILITY_URL = "http://localhost:5000/api/v2/check-slug/slug";
export const checkSlugAvailability = async (slug, tenantId, value) => {
    try {
        const response = await fetch(
            `${CHECK_SLUG_AVAILABILITY_URL}?slug=${slug}&tenantId=${tenantId}&value=${value}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const data = await response.json();

        return {
            ok: response.ok,
            status: response.status,
            available: data.available,
            message: data.message,
        };
    } catch (err) {
        console.error(err);
        return { ok: false, available: false, message: "Network error" };
    }
};