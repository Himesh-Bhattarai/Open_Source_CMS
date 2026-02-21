const FETCH_FOOTER_URL = process.env.NEXT_PUBLIC_FETCH_FOOTER_URL;
const FETCH_FOOTER_BY_ID = process.env.NEXT_PUBLIC_FETCH_FOOTER_BY_ID;

//get footer
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

//get specified footer
export const fetchFooterById = async (footerId) => {
  try {
    const response = await fetch(`${FETCH_FOOTER_BY_ID}/${footerId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok)
      return {
        ok: response.ok,
        status: response.status,
        message: request.message,
      };
    return { ok: response.ok, status: response.status, data: request };
  } catch (err) {
    console.error(err);
  }
};
