import logger from './logger.js';

// middleware/errorHandler.js

export const errorHandler = (err, req, res, next) => {
    logger.error(
        `${req.method} ${req.originalUrl}`,
        err
    );

    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error'
    });
};
