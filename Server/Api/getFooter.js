import {Footer} from "../Models/Footer/Footer.js";


export const getFooter = async (req, res, next)=>{
    try{
        const footer = await Footer.findOne({
            tenantId: req.tenant._id
        });

        if(!footer) throw new Error("Footer not found");
        res.json({
            footer
        })

    }catch(err){
        next(err)
    }
}