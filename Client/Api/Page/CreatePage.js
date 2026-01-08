
const CREATE_PAGE_URL = "http://localhost:5000/api/v1/create-page/page";

export const createPage = async (data)=>{
    if(!data) throw new Error("No data Provided");

    const response = await fetch(CREATE_PAGE_URL,{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
            
        },
        credentials: "include",
        body: JSON.stringify(data)


    });

    return response.json();
}


export const checkSlugAvailability = async(data)=>{
    return true
}

const GET_PAGE_URL = "http://localhost:5000/api/v1/get-page/page";
export const getPage = async()=>{
    try{
        const response = await fetch(GET_PAGE_URL);
        return response.json();
    }catch(err){
        console.error(err);
    }
}