import { User } from '../../../Models/Client/User.js';
import { Session } from '../../../Models/Client/Session.js';
import { logger as log } from '../../../Utils/Logger/logger.js';
import { verifyAccessToken } from '../../../Utils/JWT/jwt.js';

export const logoutCheckpoint = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            const err = new Error("No access token found");
            err.statusCode = 401;
            throw err;
        }

        const payload = verifyAccessToken(token);
        const userId = payload.userId;

        log.info(`Logout Attempt by: ${userId}`);

        // Clear cookies
        res.clearCookie('accessToken', { httpOnly: true });
        res.clearCookie('refreshToken', { httpOnly: true });

        // Clear session tokens
        await Session.findOneAndUpdate({ userId }, { $set: { logoutAt: new Date(),  refreshToken: null } });

        log.info(`Logout Successful by: ${userId}`);
        return res.status(200).json({ message: "Logout successful" });

    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
};
