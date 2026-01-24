const GET_STATS_URL = "http://localhost:5000/api/v1/statistics/stats";

export const fetchStats = async (types) => {
  const response = await fetch(`${GET_STATS_URL}/${types}`, {
    method: "GET",
    credentials: "include",
  });

  const request = await response.json();
  if (!response.ok) throw new Error(request.message);
  return request;
};
