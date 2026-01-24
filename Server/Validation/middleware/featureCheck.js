// middleware/featureCheck.js
export const featureCheck = (feature) => {
  return (req, res, next) => {
    if (!req.tenant.integrations?.[feature]) {
      return res.status(403).json({
        error: `${feature} integration is not enabled`,
      });
    }
    next();
  };
};
