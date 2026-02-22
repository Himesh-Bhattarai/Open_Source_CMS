const GET_STATS_URL = process.env.NEXT_PUBLIC_GET_STATS_URL;

//Get Stats
export const fetchStats = async (types) => {
  const response = await fetch(`${GET_STATS_URL}/${types}`, {
    method: "GET",
    credentials: "include",
  });

  const request = await response.json();
  if (!response.ok) throw new Error(request.message);
  return request;
};
