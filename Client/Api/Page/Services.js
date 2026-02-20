const CHECK_SLUG_AVAILABILITY_URL = process.env.NEXT_PUBLIC_CHECK_SLUG_AVAILABILITY_URL;
const RESTORE_PAGE_VERSION_URL = process.env.NEXT_PUBLIC_RESTORE_PAGE_VERSION_URL;
// Delete User Pages for Admin by Id
const DELETE_USER_PAGES_URL = process.env.NEXT_PUBLIC_DELETE_USER_PAGES_URL;
//delete User All page selected by user
const DELETE_USER_SELECTED_PAGE_URL =process.env.NEXT_PUBLIC_DELETE_USER_SELECTED_PAGE_URL;

const DELETE_USER_PAGES_BY_ID = process.env.NEXT_PUBLIC_DELETE_USER_PAGES_BY_ID;

const BULK_PAGES_DEL_BY_ADMIN = process.env.NEXT_PUBLIC_BULK_PAGES_DEL_BY_ADMIN;

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

//check slug
export const checkSlugAvailability = async (slug, tenantId) => {
  try {
    const response = await fetch(
      `${CHECK_SLUG_AVAILABILITY_URL}?slug=${slug}&tenantId=${tenantId}`,
      {
        method: "GET",
        credentials: "include",
      },
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

// restore page but may not using
export const restorePageVersion = async (versionId) => {
  try {
    const response = await fetch(`${RESTORE_PAGE_VERSION_URL}/${versionId}`, {
      method: "GET",
      credentials: "include",
    });

    const request = await response.json();
    if (!response.ok) {
      const error = new Error(request?.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return request;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//delete user page by id
export const deleteUserPageById = async (pageId) => {
  try {
    const response = await fetch(`${DELETE_USER_PAGES_BY_ID}/${pageId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const request = await parseJsonSafe(response);
    if (!response.ok)
      throw new Error(request?.message || `HTTP error! status: ${response.status}`);
    return {
      ok: response.ok,
      status: response.status,
      message: request?.message || "Page deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      message: err?.message || "Delete failed",
    };
  }
};

//delete all user Page selected by user
export const deleteUserSelectedPage = async (pageIds) => {
  try {
    const response = await fetch(`${DELETE_USER_SELECTED_PAGE_URL}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pageIds: pageIds }),
    });

    const request = await parseJsonSafe(response);
    if (!response.ok)
      throw new Error(request?.message || `HTTP error! status: ${response.status}`);
    return {
      ok: true,
      status: response.status,
      message: request?.message || "Pages deleted successfully",
      data: request,
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      message: err?.message || "Bulk delete failed",
      data: null,
    };
  }
};
//delete all user pages for admin by id
export const deleteUserPages = async () => {
  try {
    const response = await fetch(`${DELETE_USER_PAGES_URL}`, {
      method: "DELETE",
      credentials: "include",
    });
    const request = await parseJsonSafe(response);
    if (!response.ok)
      throw new Error(request?.message || `HTTP error! status: ${response.status}`);
    return {
      ok: true,
      status: response.status,
      message: request?.message || "All pages deleted successfully",
      data: request,
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      message: err?.message || "Delete all pages failed",
      data: null,
    };
  }
};

//Bulk user pages delete by admin for admin
export const bulkDeleteUserPagesByAdmin = async (userIds) => {
  try {
    const response = await fetch(`${BULK_PAGES_DEL_BY_ADMIN}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userIds: userIds }),
    });
    const request = await parseJsonSafe(response);
    if (!response.ok)
      throw new Error(request?.message || `HTTP error! status: ${response.status}`);
    return {
      ok: true,
      status: response.status,
      message: request?.message || "Pages deleted successfully",
      data: request,
    };
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      status: 500,
      message: err?.message || "Admin bulk delete failed",
      data: null,
    };
  }
};
