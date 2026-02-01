const DELETE_FOOTER_BY_ID = "http://localhost:5000/api/v1/delete-footer/footer";


//delete footer by id
export const deleteFooterById = async (footerId) => {
  try{
    const response = await fetch(`${DELETE_FOOTER_BY_ID}/${footerId}`,{
      method: "DELETE",
      credentials: "include"
    });

    const data = await response.json();

    if(!response.ok) throw new Error("Internal server Error");
    return{
      ok: response.ok,
      status: response.status,
      message: data.message,
    }
  }catch(err){
    console.error(err);
  }
};
