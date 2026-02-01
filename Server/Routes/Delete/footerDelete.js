import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js"
import { Footer } from "../../Models/Footer/Footer.js";

const router = express.Router();

router.delete("/footer/:footerId", verificationMiddleware,
    async(req, res)=>{
        const userId = req.user?.userId;
        const footerId = req.params?.footerId;

        if(!userId || !footerId) throw new Error("Unauthorized");
        const footer = await Footer.findOne({_id: footerId, userId});
        if(!footer) throw new Error("Footer not found");

        const deleteFooter = await Footer.deleteOne({_id: footerId, userId});

        notif.deleteFooter({ userId, footerName: deleteFooter.footerName, footerId: deleteFooter._id, websiteId: deleteFooter.websiteId })

        res.status(200).json(deleteFooter)
    }
);

export default router;