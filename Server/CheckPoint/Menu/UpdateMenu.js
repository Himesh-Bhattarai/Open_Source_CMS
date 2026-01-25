import { Menu } from "../../Models/Menu/Menu.js";
import { logger as log } from "../../Utils/Logger/logger.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

export const updateMenuCheckpoint = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const menuId = req.params.menuId;
    const {
      title,
      description,
      menuLocation,
      status,
      publishedAt,
      publishedBy,
      items,
    } = req.body;

    if (!userId) throw new Error("Unauthorized access");
    if (!menuId)
      return res.status(400).json({ message: "Menu ID is required" });

    log.info(`User ${userId} attempting to update menu ${menuId}`);

    // Fetch existing menu
    const menu = await Menu.findOne({ _id: menuId, userId });
    if (!menu) return res.status(404).json({ message: "Menu not found" });

    // Phase 2 updates (title, description, location, status)
    menu.title = title ?? menu.title;
    menu.description = description ?? menu.description;
    menu.menuLocation = menuLocation ?? menu.menuLocation;
    menu.status = status ?? menu.status;
    menu.publishedAt = publishedAt ?? menu.publishedAt;
    menu.publishedBy = publishedBy ?? menu.publishedBy;

    // Recursive function to normalize items & children
    const normalizeItems = (itemsArray) => {
      if (!Array.isArray(itemsArray)) return [];
      return itemsArray.map((item) => ({
        _id: item._id || undefined, // optional
        label: item.label ?? "", // save empty if not provided
        type: item.type ?? "", // save empty if not provided
        link: item.link ?? "", // save empty if not provided
        enabled: item.enabled ?? true, // default true if not provided
        order: item.order ?? 0, // default 0 if not provided
        children: normalizeItems(item.children), // recursive children
      }));
    };

    if (Array.isArray(items)) {
      menu.items = normalizeItems(items);
    }

    await menu.save();

    log.info(`Menu ${menuId} updated successfully by user ${userId}`);

    notif.createMenu({ userId, menuName: menu.title, menuId, websiteId: menu.tenantId, location: menu.menuLocation });

    res.status(200).json({
      success: true,
      menu,
    });
  } catch (err) {
    log.error(`Failed to update menu: ${err.message}`);
    next(err);
  }
};
