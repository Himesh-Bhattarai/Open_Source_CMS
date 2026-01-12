const DELETE_BLOG_BY_ID = "http://localhost:5000/api/v1/delete-blog/blog";

export const deleteBlogById = async(blogId)=>{
    try{
        console.log("Deleting blog with ID:", blogId);
        const response = await fetch(`${DELETE_BLOG_BY_ID}/${blogId}`,{
            method: "DELETE",
            credentials: "include"
        });

        const request = response.json();
        if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return {ok: response.ok, status: response.status, request, message: "Blog deleted successfully"};
    }catch(err){
        console.log(err);
        const error = new Error(`HTTP error! status: ${response.status}`);
    }
}