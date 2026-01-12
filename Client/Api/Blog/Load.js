const ALL_BLOG_LOAD_API = "http://localhost:5000/api/v1/blog/load-all";
const BLOG_LOAD_BY_ID_API = "http://localhost:5000/api/v1/blog/load";

export const loadAllBlogs = async() =>{
    try{
        const response = await fetch(ALL_BLOG_LOAD_API,{
            method: "GET",
            credentials: "include"
        });

        const request = response.json();
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return request;
    }catch(err){
        console.log(err);
        const error = new Error(`HTTP error! status: ${response.status}`);
    }
}

//load blog by id
export const loadBlogById = async(blogId)=>{
    try{
        const response = await fetch(`${BLOG_LOAD_BY_ID_API}/${blogId}`,{
            method: "GET",
            credentials: "include"
        });

        const request = response.json();
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return request;
    }catch(err){
        console.log(err);
        const error = new Error(`HTTP error! status: ${response.status}`);
    }
}