import { id } from "date-fns/locale";

const VALIDATE_USER = "http://localhost:5000/api/v1/validate/user-payload";
const FEEDBACK_COLLECT = "http://localhost:5000/api/v1/feedback/user/collect";
const CHANGE_PASSWORD = "http://localhost:5000/api/v1/user/password//change-password";
const GET_API_KEYS = "http://localhost:5000/api/v1/api-keys/user/get-keys";
export const validateUser = async (par1, par2)=>{
    try{
        const response = await fetch(VALIDATE_USER,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: "include",
            body:JSON.stringify( { par1, par2 } )
        });

        const data = await response.json();
        if(!data.ok) throw new Error("Internal Server Error");

        return{
            ok: response.ok,
            status: response.status,
            message: data.message,
            shouting: data.shouting
        }

    }catch(err){
        return{
            ok:false,
            message : "Network error",
            status:500,
            shouting: data.shouting
        }
    }
};


export const feedbackCollector = async (payload)=>{
    try{
        const response = await fetch(FEEDBACK_COLLECT,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            credentials: "include",
            body:JSON.stringify(payload)
            
        });

        const data = await response.json();
        if(!data.ok) throw new Error("Internal Server Error");
        return{
            ok: response.ok,
            status: response.status,
            data: data.data || [],
        }
    }catch(err){
        return{
            ok: false,
            status: 500,
            message: "Network error",
            data: [],
        }
    }
}


//Change password

export const changePassword = async (payload)=>{
    try{
        const response = await fetch(CHANGE_PASSWORD, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",

            },
            credentials: "include",
            body:JSON.stringify(payload)
        });

        const data = response.json();

        if(!data.ok) throw new Error("Internal server error");

        return{
            ok: response.ok,
            status: response.status,
            message: data.message,
        }
    }catch(err){
        return{
            ok: false,
            status: 500,
            message: "Network error",
        }
    }
}


//get api keys
export const getApiKeys = async()=>{
try{
    const response = await fetch(GET_API_KEYS,{
        credentials: "include",
        method:"GET",

    });

    const data = await response.json();

    if(!data.ok) throw new Error("Internal server error");

    return{
        ok: response.ok,
        status: response.status,
        data: data.data || [],
    }
}catch(err){
    return{
        ok: false,
        status: 500,
        message: "Network error",
        data: [],
    }
}
}
