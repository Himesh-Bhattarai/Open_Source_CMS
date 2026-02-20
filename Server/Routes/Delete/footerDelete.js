import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js"
import { Footer } from "../../Models/Footer/Footer.js";

const router = express.Router();

router.delete("/footer/:footerId", verificationMiddleware,
    async(req, res, next)=>{
        try {
            const userId = req.user?.userId;
            const footerId = req.params?.footerId;

            if(!userId || !footerId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const footer = await Footer.findOne({_id: footerId, userId});
            if(!footer) {
                return res.status(404).json({ message: "Footer not found" });
            }

            await Footer.deleteOne({_id: footerId, userId});

            notif.deleteFooter({
                userId,
                footerName: footer.footerName,
                footerId: footer._id,
                websiteId: footer.websiteId,
            })

            return res.status(200).json({ message: "Footer deleted successfully" })
        } catch (err) {
            next(err);
        }
    }
);

export default router;
