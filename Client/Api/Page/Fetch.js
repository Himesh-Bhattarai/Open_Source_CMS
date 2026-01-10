const GET_PAGE_URL = "http://localhost:5000/api/v1/page/get-page";
const GET_PAGE_BY_ID = "http://localhost:5000/api/v1/page/selected-page";
const GET_ALL_PAGES_URL = "http://localhost:5000/api/v1/page/all-pages";

export const getUserPage = async(pageId)=>{
    try{
        const response = await fetch(`${GET_PAGE_URL}/${pageId}`,{
            method: "GET",
            credentials: "include"
        });

        const request = await response.json();
        return request;
    }catch(err){
        console.error(err);
    }
};

//Get User page By Id
export const getPageById = async(pageId)=>{
    try{
        const response = await fetch(`${GET_PAGE_BY_ID}/${pageId}`,{
            method: "GET",
            credentials: "include"
        });

        const request = await response.json();
        return request;
    }catch(err){
        console.error(err);
    }
}

//For Admin Get All Pages
export const getAllPage = async ()=>{
    try{
        const response = await fetch(GET_ALL_PAGES_URL,{
            method: "GET",
            credentials: "include"
        });

        const request = await response.json();
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return request;
    }catch(err){
        console.error(err);
    }
}