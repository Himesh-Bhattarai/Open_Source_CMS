const CMS_FOOTER_API = process.env.NEXT_PUBLIC_CMS_FOOTER_API;


//Api call to fetch footer data form this cms
export const fetchFooter = async () => {
    try {
        const response = await fetch(CMS_FOOTER_API, {
            method: "GET",
            headers: {
                Authorization: "Bearer 1b6758ca1b4e451d34ea9f215b9c3ff924b2627ca984188d6a5165fe2e7e1d17"
            }
        });

        const data = await response.json();
        if (!response.ok) throw new Error("Internal Server Error");
        return {
            ok: response.ok,
            data: data?.footer
        }
    } catch (err) {
        console.error(err);
        return {
            ok: false,
            data: []
        }
    }
}