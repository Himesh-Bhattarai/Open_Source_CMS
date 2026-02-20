import bcrypt from "bcrypt";
import { User } from "../../../Models/Client/User.js";
import { Session } from "../../../Models/Client/Session.js";
import { generateTokens, getCookieOptions } from "../../../Utils/Jwt/Jwt.js";
import { logger as log } from "../../../Utils/Logger/logger.js";
import {cmsEventService as notif} from "../../../Services/notificationServices.js"
export const registerCheckpoint = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    log.info(`Register Attempt by: ${email} name: ${name}`);

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      log.warn(`Failed register attempt: ${email}`);
      const err = new Error("User already exists");
      err.statusCode = 400;
      throw err;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      email,
      passwordHash,
      name,
      role: "web-owner",
    });

    // Generate tokens
    const payload = { userId: newUser._id, role: newUser.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    // Save session
    await Session.create({
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      refreshToken: await bcrypt.hash(refreshToken, 10),
    });

    // Send cookies
    res.cookie("accessToken", accessToken, getCookieOptions(15 * 60 * 1000));
    res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

    log.info(`Register success: ${email}`);
notif.registerUser({userId : newUser._id, email, name});

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    err.statusCode = err.statusCode || 500;
    next(err);
  }
};
