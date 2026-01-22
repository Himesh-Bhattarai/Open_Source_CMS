import {Seo} from "../../Models/Seo/Seo.js";

export const getSeo = async(req, res, next)=>{
    try{
        const getSeo = await Seo.findOne({
            tenantId: req.tenantId._id,
            status: "published"
        })

        if(!getSeo) throw new Error("Seo not Found");
        res.json({
            getSeo
        })
    }catch(err){
        next(err)
    }
}