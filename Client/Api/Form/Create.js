const CREATE_FORM_URL = "http://localhost:5000/api/v1/create-form/form";

export const createForm = async(data)=>{
    console.log("What is the data Structure ", data);
    try{
        const response = await fetch(CREATE_FORM_URL,{
            method: "POST",
            credentials: "include",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
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