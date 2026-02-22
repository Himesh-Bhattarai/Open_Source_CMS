export const okHandler =
  (payload = { ok: true }, status = 200) =>
  (req, res) =>
    res.status(status).json(payload);

export const failingHandler =
  (message = "boom", statusCode = 500) =>
  (req, res, next) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    next(err);
  };

export const nextMiddleware = () => (req, res, next) => next();
