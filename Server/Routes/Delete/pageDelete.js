import express from 'express';
import {Page} from "../../Models/Page/Page.js";
import { verificationMiddleware } from '../../Utils/Jwt/Jwt.js';
const router = express.Router();


//--------------------------[USER] DELETE PAGE BY ID--------------------------//
router.delete("/user-page/:id", verificationMiddleware, async (req, res) => {
try {
    const pageId = req.params.id
    const userId = req.user?.userId

    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" })
    }

    const deleted = await Page.findOneAndDelete({
        _id: pageId,
        authorId: userId
    })

    if (!deleted) {
        return res.status(404).json({ message: "Page not found or not owned" })
    }

    return res.status(200).json({ message: "Page deleted successfully" })
} catch (err) {
    console.error("Error deleting page:", err)
    return res.status(500).json({ message: "Internal server error" })
}
})
export default router;