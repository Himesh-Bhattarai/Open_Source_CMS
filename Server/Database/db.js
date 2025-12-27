import mongoose from "mongoose";
import {logger as log} from "../../../Utils/Logger/logger.js";

export const connectDB = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI);
        log.info(`MongoDB Connected: ${connection.connection.host} PORT: ${connection.connection.port}`);
    }catch(error){
        log.error(error.message);
        process.exit(1);
    }
}