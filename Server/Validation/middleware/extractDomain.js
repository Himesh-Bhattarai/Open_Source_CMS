export const extractDomain = (req, res, next) => {
    const fullPath = req.originalUrl;

    const pathWithoutBase = fullPath.replace("/api/v1/external-request/", "");
    const parts = pathWithoutBase.split("/").filter(Boolean);

    if (parts.length === 0) {
        return res.status(400).json({ error: "Invalid URL. Must include domain." });
    }

    req.domain = parts[0];

    const remainingPath =
        parts.length > 1 ? "/" + parts.slice(1).join("/") : "/";

    req.url = remainingPath;

    console.log({
        originalUrl: fullPath,
        domain: req.domain,
        rewrittenUrl: req.url,
    });

    next();
};
