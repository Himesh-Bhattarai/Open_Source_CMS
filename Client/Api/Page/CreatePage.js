
const CREATE_PAGE_URL = "http://localhost:5000/api/v1/create-page/page";

export const createPage = async (data)=>{
    if(!data) throw new Error("No data Provided");

    const response = await fetch(CREATE_PAGE_URL,{
        method: "POST",
        credentials: "include",
        headers:{
            "Content-Type": "application/json"

        },
        body: JSON.stringify(data)


    });

    return response.json();
}