import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Form } from "../../Models/Form/Form.js";

const router = express.Router();

router.delete("/form/:formId",
    verificationMiddleware,
    async(req, res)=>{
        const userId = req.user?.userId;
        const formId = req.params.formId;
        if(!userId || !formId) throw new Error("Unauthorized");

        const form = await Form.findById({_id: formId});
        if(!form) throw new Error("Form not found");

        const deleteForm = await Form.findByIdAndDelete({_id: formId});

        res.status(200).json({message: "Form Deleted Successfully",
            data: deleteForm
        });
    }
)

export default router;