export const INTEGRATION_DOCS_ROUTE = "/cms/integrations/docs";

export const buildApiTestCommand = (endpointUrl: string) => {
  const safeUrl = String(endpointUrl || "").trim();
  if (!safeUrl) return "";
  return `curl -i -b cms.cookies.txt "${safeUrl}"`;
};
