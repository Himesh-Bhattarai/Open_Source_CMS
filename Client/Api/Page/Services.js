const CHECK_SLUG_AVAILABILITY_URL = "http://localhost:5000/api/v1/check-slug/slug";
const RESTORE_PAGE_VERSION_URL = "http://localhost:5000/api/v1/restore-page-version/page-version";
// Delete User Pages for Admin by Id
const DELETE_USER_PAGES_URL = "http://localhost:5000/api/v1/delete/user-pages";
//delete User All page selected by user
const DELETE_USER_SELECTED_PAGE_URL =
"http://localhost:5000/api/v1/delete/user-selected-page";
//Delete User Specific selected Page by ID
const DELETE_USER_PAGES_BY_ID = "http://localhost:5000/api/v1/delete/user-page";

const BULK_PAGES_DEL_BY_ADMIN = "http://localhost:5000/api/v1/delete/pages/bulk-delete/byAdmin";
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

//delete user page by id
export const deleteUserPageById = async (pageId) => {
  try {
    const response = await fetch(`${DELETE_USER_PAGES_BY_ID}/${pageId}`, {
      method: "DELETE",
      credentials: "include"
    });

    const request = response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return { ok: response.ok, status: response.status, message: "Page deleted successfully" };
  } catch (err) {
    console.log(err);
    const error = new Error(`HTTP error! status: ${response.status}`);
  }
}


//delete all user Page selected by user 
export const deleteUserSelectedPage = async (pageIds) => {
  try {
    const response = await fetch(`${DELETE_USER_SELECTED_PAGE_URL}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ pageIds: pageIds })
    });

    const request = response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.log(err);
    const error = new Error(`HTTP error! status: ${response.status}`);
  }
}

//delete all user pages for admin by id
export const deleteUserPages = async () => {
  try {
    const response = await fetch(`${DELETE_USER_PAGES_URL}`, {
      method: "DELETE",
      credentials: "include",
    });
    const request = response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.log(err);
    const error = new Error(`HTTP error! status: ${response.status}`);
  }
}


//Bulk user pages delete by admin for admin
export const bulkDeleteUserPagesByAdmin = async (userIds) => {
  try {
    const response = await fetch(`${BULK_PAGES_DEL_BY_ADMIN}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userIds: userIds })
    });
    const request = response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return request;
  } catch (err) {
    console.log(err);
    const error = new Error(`HTTP error! status: ${response.status}`);

  }
}
