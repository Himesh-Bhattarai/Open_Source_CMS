import { PageBlock } from "../../Models/Page/PageBlock";
import { logger as log } from "../../Utils/Logger/logger.js";

export const pageBlockCheckpoint = (req, res, next)=>{
    try{

        const{userId, type, order, data} = req.body;
        
        if(!userId || !type){
        const err = new Error("Missing required fields");
        err.statusCode = 400;
        throw err;
    }

    log.info(`Page Block Creation Attempt by: ${userId}`)
    
    const pageBlock = PageBlock.create({
        _id: userId,
        type,
        order,
        data
    });

    log.info(`Page Block created by: ${userId} Date: ${pageBlock.createdAt}`)

    res.status(200).json({
        message: "Page Block created successfully by " + userId,
    })
}catch(err){
    err.statusCode = err.statusCode || 400;
    next(err);
}
}