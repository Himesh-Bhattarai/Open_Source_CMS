import { MenuItem } from "../../Models/Menu/MenuItem.js";

const createMenuItemsRecursively = async ({
    items,
    menuId,
    userId,
    parentId = null,
}) => {
    const ids = [];

    for (const item of items) {
        const created = await MenuItem.create({
            userId,
            menuId,
            parentId,
            label: item.label,
            type: item.type,
            link: item.link,
            enabled: item.enabled ?? true,
            order: item.order ?? 0,
        });

        if (item.children && item.children.length > 0) {
            const childIds = await createMenuItemsRecursively({
                items: item.children,
                menuId,
                userId,
                parentId: created._id,
            });

            created.children = childIds;
            await created.save();
        }

        ids.push(created._id);
    }

    return ids;
};

export default createMenuItemsRecursively;
