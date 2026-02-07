const VALIDATE_USER = "http://localhost:5000/api/v1/validate/user-payload";
const FEEDBACK_COLLECT = "http://localhost:5000/api/v1/feedback/user/collect"

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


export const feedbackCollector = async (data)=>{
    try{
        const response = await fetch(FEEDBACK_COLLECT,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            credentials: "include",
            body:JSON.stringify(data)
            
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
