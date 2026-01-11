const CHECK_SLUG_AVAILABILITY_URL =
  "http://localhost:5000/api/v1/check-slug/slug";
const RESTORE_PAGE_VERSION_URL =
  "http://localhost:5000/api/v1/restore-page-version/page-version";

export const checkSlugAvailability = async (slug, tenantId) => {
  try {
    const response = await fetch(
      `${CHECK_SLUG_AVAILABILITY_URL}?slug=${slug}&tenantId=${tenantId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      available: data.available,
      message: data.message,
    };
  } catch (err) {
    console.error(err);
    return { ok: false, available: false, message: "Network error" };
  }
};

export const restorePageVersion = async (versionId) => {
  try {
    const response = await fetch(`${RESTORE_PAGE_VERSION_URL}/${versionId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.log(err);
    const error = new Error(`HTTP error! status: ${response.status}`);
  }
};
