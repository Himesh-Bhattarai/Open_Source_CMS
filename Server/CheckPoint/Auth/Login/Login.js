import { logger as log } from "../../../Utils/Logger/logger.js"
import { User } from "../../../Models/Client/User.js"
import bcrypt from "bcrypt"
import { generateToken } from "../../../Utils/JWT/jwt.js"
export const loginCheckpoint = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const err = new Error("Missing email or password");
            err.statusCode = 400;
            throw err
        }

        log.info(`Login Attempt by: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            log.warn(`Failed login attempt by: ${email}`);
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err
        }

        if (user.status !== "active") {
            const err = new Error(`User is ${user.status}`);
            err.statusCode = 401;
            throw err
        }
        //Compare password bcrypt
        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) {
            log.warn(`Failed login attempt by: ${email}`);
            const err = new Error("Invalid credentials");
            err.statusCode = 401;
            throw err
        }

        //check user is admin or web owner and send redirect in response login successful
        const redirect = user.role === "admin" ? "/admin/dashboard" : "/dashboard";

        //Generate Token payload
        const payload = {
            userId: user._id,
            role: user.role,
        };

        const { accessToken, refreshToken } = await generateToken(payload);

        //save into Database 
        const CheckSession = await Session.findOne({ userId: user._id });
        //if not token save else update
        if (!CheckSession) {
            await Session.create({
                userId: user._id,
                name: user.name,
                accessToken: await bcrypt.hash(accessToken, 10),
                refreshToken: await bcrypt.hash(refreshToken, 10),
            });
        } else {
            await Session.updateOne(
                { userId: user._id },
                {
                    accessToken: await bcrypt.hash(accessToken, 10),
                    refreshToken: await bcrypt.hash(refreshToken, 10),
                }
            );

        }

        //send token in cookies both access and refresh
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 minutes

        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        //send response with user details except password
        return res.status(200).json({
            message: `Successfully logged in as ${email}`,
            redirect
        })
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }

}