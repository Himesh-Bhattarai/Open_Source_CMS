import { Menu } from "../../Models/Menu/Menu.js";
import express from 'express';
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
const router = express.Router();

//Delete menu by Id 
router.delete('/menu/:menuId', verificationMiddleware,
    async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            const menuId = req.params.menuId;
            if (!userId) throw new Error("Unauthorized");
            if (!menuId) return res.status(400).json({ message: "Menu ID is required" });


            const deleteMenu = await Menu.findOneAndDelete({ _id: menuId, userId: userId });
            if (!deleteMenu) return res.status(404).json({ message: "Menu not found or already deleted" });

            return res.status(200).json({ message: "Menu deleted successfully" });
        } catch (err) {
            next(err);
        }
    }
)


export default router;