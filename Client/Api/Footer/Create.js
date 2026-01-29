const FOOTER_URL = "http://localhost:5000/api/v1/create-footer/footer";
const UPDATE_FOOTER_URL = " http://localhost:5000/api/v1/update-footer/footer";


//create footer
export const createFooter = async (data) => {
  const response = await fetch(FOOTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const request = await response.json();
  if (response.ok)
    return {
      ok: response.ok,
      status: response.status,
      message: response.message || "Footer created successfully",
      data: request,
    };
};


//update footer
export const updateFooter = async (id, data) => {
  const response = await fetch(`${UPDATE_FOOTER_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const request = await response.json();
  return {
    ok: response.ok,
    status: response.status,
    message: response.message || "Footer updated successfully",
    data: request,
  };
};
