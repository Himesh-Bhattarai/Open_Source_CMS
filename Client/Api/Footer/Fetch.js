const FETCH_FOOTER_URL = "http://localhost:5000/api/v1/footer/get-footer";

export const fetchFooter = async ()=>{
    const response = await fetch(FETCH_FOOTER_URL,{
        credentials: "include",
        method: "GET"

    });

    const request = await response.json();

    return {
        ok: response.ok,
        status: response.status,
        data: request
    }
}