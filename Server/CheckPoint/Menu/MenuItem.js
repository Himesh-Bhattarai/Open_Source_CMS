import { Menu } from "../../Models/Menu/Menu.js";
import { MenuItem } from "../../Models/Menu/MenuItem.js";

export const menuItemCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { menuId, ...itemData } = req.body;

        if (!userId || !menuId) {
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        // 1️⃣ Ensure menu exists
        const menu = await Menu.findOne({
            _id: menuId,
            userId,
        });

        if (!menu) {
            const err = new Error("Menu not found");
            err.statusCode = 404;
            throw err;
        }

        // 2️⃣ Create menu item
        const newMenuItem = await MenuItem.create({
            ...itemData,
            userId,
            menuId,
        });

        // 3️⃣ Attach menu item to menu
        await Menu.findByIdAndUpdate(menuId, {
            $push: { items: newMenuItem._id },
        });

        // 4️⃣ Respond
        res.status(201).json({
            success: true,
            item: newMenuItem,
        });
    } catch (err) {
        err.statusCode = err.statusCode || 400;
        next(err);
    }
};
