const FOOTER_URL = process.env.NEXT_PUBLIC_FOOTER_URL;
const UPDATE_FOOTER_URL = process.env.NEXT_PUBLIC_UPDATE_FOOTER_URL;


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
