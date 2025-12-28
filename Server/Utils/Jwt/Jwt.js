import jwt from 'jsonwebtoken';

//import Jwt secret form env
// refresh and access token with expire
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;



//Cookies Token Generation and Verification
export const generateTokens = (payload) => {
    const accessToken = jwt.sign(
        { ...payload, type: 'access' },
        ACCESS_TOKEN,
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { userId: payload.userId, type: 'refresh' },
        REFRESH_TOKEN,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN, {
        algorithms: ['HS256']
    });
};


export const verifyRefreshToken = async (token) => {
    const decoded = jwt.verify(token, REFRESH_TOKEN);

    // Must check DB
    const session = await Session.findOne({
        userId: decoded.userId,
        tokenHash: hash(token)
    });

    if (!session) throw new Error('Invalid refresh token');

    return decoded;
};

