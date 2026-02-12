const LOAD_MEDIA = process.env.NEXT_PUBLIC_LOAD_MEDIA;


//load media
export const loadMedia = async () => {
  try {
    const response = await fetch(LOAD_MEDIA, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (response.ok)
      return {
        ok: response.ok,
        status: response.status,
        data: request,
      };
  } catch (err) {
    console.error(err);
  }
};
