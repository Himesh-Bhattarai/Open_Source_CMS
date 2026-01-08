const LOAD_MEDIA = "http://localhost:5000/api/v1/media/get-media";

export const loadMedia = async()=>{
    try{
        const response = await fetch(LOAD_MEDIA,{
            method: "GET",
            credentials: "include",
        });

        const request = await response.json();
        if(response.ok) return{
            ok: response.ok,
            status: response.status,
            data: request
        }
    }catch(err){
        console.error(err);
    }
}