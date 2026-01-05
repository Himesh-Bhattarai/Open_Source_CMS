import { Menu } from "../../Models/Menu/Menu.js";
import createMenuItemsRecursively from "./createMenuItemsRecursively.js";

export const menuItemCheckpoint = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { menuId, items } = req.body;

        if (!userId || !menuId || !Array.isArray(items)) {
            return res.status(400).json({ message: "Invalid payload" });
        }

        const menu = await Menu.findOne({ _id: menuId, userId });
        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        // Remove previous menu items (safe replace)
        menu.items = [];
        await menu.save();

        const rootItemIds = await createMenuItemsRecursively({
            items,
            menuId,
            userId,
        });

        menu.items = rootItemIds;
        await menu.save();

        res.status(201).json({
            success: true,
            menuId,
            items: rootItemIds,
        });
    } catch (err) {
        next(err);
    }
};
