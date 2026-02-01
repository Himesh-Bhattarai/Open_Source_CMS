import { User } from "../../Models/Client/User.js";
import { logger as log } from "../../Utils/Logger/logger.js";

export const verifyMe = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    log.info(`VerifyMe Attempt by: ${userId}`);

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    log.info(`VerifyMe Successful by: ${userId}`);

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantName: user.tenantName,
    });
  } catch (err) {
    next(err);
  }
};
