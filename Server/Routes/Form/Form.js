import express from "express";
const router = express.Router();
import { formCheckpoint } from "../../CheckPoint/Form/Form.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Form } from "../../Models/Form/Form.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"
//import validate later
router.post("/form", verificationMiddleware, formCheckpoint);

router.put("/form/:formId", verificationMiddleware, async (req, res, next) => {
  const userId = req.user?.userId;
  const formId = req.params.formId;
  const { ...formData } = req.body;
  if (!userId || !formId) throw new Error("Unauthorized");

  const form = await Form.findById({ _id: formId });
  if (!form) throw new Error("Form not found");

  const updateForm = await Form.findByIdAndUpdate({ _id: formId }, formData, {
    new: true,
  });
  res.status(200).json({
    message: "Form Updated Successfully",
    data: updateForm,
  });
});
export default router;
