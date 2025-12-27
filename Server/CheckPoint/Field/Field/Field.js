import { Field } from "../../../Models/Field/Field";
import {logger as log} from "../../../Utils/Logger/logger.js";

export const fieldCheckPoint = async (req, res, next)=>{
    try{
        const {userId, name, type,order, required, options} = req.body;

        if(!userId){
            const err = new Error("Missing required fields");
            err.statusCode = 400;
            throw err;
        }

        log.info(`Field Creation Attempt by: ${userId} name: ${name}`)

        const field = await Field.create({
            _id: userId,
            name,
            type,
            order,
            required,
            options
        });

        log.info(`Field created by: ${userId} name: ${name} Date: ${field.createdAt}`);

        res.status(200).json({
            message: "Field created successfully by " + userId,
        })
    }catch(err){
        err.statusCode = err.statusCode || 400;
        next(err);
    }

}