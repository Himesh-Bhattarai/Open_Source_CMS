import { BlogPost as Blog} from "../Models/Blog/Blogpost.js";
import { Tenant } from "../Models/Tenant/Tenant.js";


export const getBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findOne({
            tenantId: req.tenant._id
        });

        if (!blog) throw new Error("Blog not found");

        // const connected = Tenant.findOne({
        //     _id: req.tenant._id
        // })

        // if(!connected) throw new Error("Tenant not found");

        // connected.
        res.json({
            blog
        })

    } catch (err) {
        next(err)
    }
}