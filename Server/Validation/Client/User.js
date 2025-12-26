import { z } from 'zod';

const LoginValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(24)
})

export const validateLogin = (req, res, next) => {
    try {
        LoginValidation.parse(req.body);
        next();
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
} 