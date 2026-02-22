const DELETE_BLOG_BY_ID = process.env.NEXT_PUBLIC_DELETE_BLOG_BY_ID;

//delete Blog by id
export const deleteBlogById = async (blogId) => {
  try {
    const response = await fetch(`${DELETE_BLOG_BY_ID}/${blogId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const request = response.json();
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return {
      ok: response.ok,
      status: response.status,
      request,
      message: "Blog deleted successfully",
    };
  } catch (err) {
    console.error(err);
    const error = new Error(`HTTP error! status: ${response.status}`);
  }
};
