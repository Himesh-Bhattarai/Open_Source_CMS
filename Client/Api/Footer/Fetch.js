const FETCH_FOOTER_URL = "http://localhost:5000/api/v1/footer/get-footer";
const FETCH_FOOTER_BY_ID = "http://localhost:5000/api/v1/footer/get-footer";

export const fetchFooter = async () => {
  const response = await fetch(FETCH_FOOTER_URL, {
    credentials: "include",
    method: "GET",
  });

  const request = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data: request,
  };
};

export const fetchFooterById = async(footerId)=>{
  try{
    const response = await fetch(`${FETCH_FOOTER_BY_ID}/${footerId}`,{
      method: "GET",
      credentials: "include"
    }
    );

    const request = await response.json();
    if(!response.ok) return { ok: response.ok, status: response.status, message: request.message };
    return { ok: response.ok, status: response.status, data: request };
  }catch(err){
    console.error(err);
  }
}
