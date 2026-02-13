
const VALIDATE_USER = process.env.NEXT_PUBLIC_VALIDATE_USER;
const FEEDBACK_COLLECT = process.env.NEXT_PUBLIC_FEEDBACK_COLLECT;
const CHANGE_PASSWORD = process.env.NEXT_PUBLIC_CHANGE_PASSWORD;
const GET_API_KEYS = process.env.NEXT_PUBLIC_GET_API_KEYS;
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
