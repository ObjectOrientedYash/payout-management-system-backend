/**
 * Standardized API Response Utility
 */

export const sendSuccess = (res, statusCode = 200, data = null, message = 'Success') => {
    return res.status(statusCode).json({
        status: 'success',
        code: statusCode,
        message,
        data,
    });
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', error = null) => {
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message,
        error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
};
