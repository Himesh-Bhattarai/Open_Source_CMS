import { z } from 'zod';


//login validation and zod middleware
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


//Register validation and zod middleware
const RegisterValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(24),
    name: z.string().min(2).max(50),
    role: z.enum(["admin", "web-owner"]).default("web-owner"),
});

export const validateRegister = (req, res, next) =>{
    try{
        RegisterValidation.parse(req.body);
        next();
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err);
    }
}