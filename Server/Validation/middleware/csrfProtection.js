const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const EXEMPT_PATH_PREFIXES = ["/api/v1/external-request", "/health"];

const parseAllowedOrigins = () => {
  const fromCors = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const fromFrontend = (process.env.FRONTEND_AUTH_REDIRECT || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([...fromCors, ...fromFrontend]);
};

const originFromReferer = (refererValue = "") => {
  try {
    return new URL(refererValue).origin;
  } catch {
    return "";
  }
};

export const csrfProtection = (req, res, next) => {
  if (process.env.CSRF_PROTECTION === "false") {
    return next();
  }

  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  if (EXEMPT_PATH_PREFIXES.some((prefix) => String(req.path || "").startsWith(prefix))) {
    return next();
  }

  // CSRF risk applies to cookie-authenticated browser requests.
  const cookieHeader = req.headers?.cookie || "";
  if (!cookieHeader) {
    return next();
  }

  const allowedOrigins = parseAllowedOrigins();
  if (allowedOrigins.size === 0) {
    return next();
  }

  const originHeader = String(req.headers?.origin || "").trim();
  const refererHeader = String(req.headers?.referer || "").trim();
  const requestOrigin = originHeader || originFromReferer(refererHeader);

  if (!requestOrigin) {
    return res.status(403).json({
      message: "CSRF check failed: missing Origin/Referer",
    });
  }

  if (!allowedOrigins.has(requestOrigin)) {
    return res.status(403).json({
      message: "CSRF check failed: origin not allowed",
    });
  }

  return next();
};
