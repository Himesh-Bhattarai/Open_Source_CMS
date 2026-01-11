const FOOTER_URL = "http://localhost:5000/api/v1/create-footer/footer";

export const createFooter = async (data) => {
  console.log("Footer Structure", data);
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
      data: request,
    };
};
