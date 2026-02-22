import express from "express";
const router = express.Router();
import { formCheckpoint } from "../../CheckPoint/Form/Form.js";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Form } from "../../Models/Form/Form.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";
//import validate later
router.post("/form", verificationMiddleware, formCheckpoint);

router.put("/form/:formId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const formId = req.params.formId;
    const { ...formData } = req.body;
    if (!userId || !formId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const form = await Form.findById({ _id: formId });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (String(form.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updateForm = await Form.findByIdAndUpdate({ _id: formId }, formData, {
      new: true,
    });

    notif.updateForm({
      userId,
      formName: updateForm?.name,
      formId: updateForm?._id,
      websiteId: updateForm?.tenantId,
    });

    return res.status(200).json({
      message: "Form Updated Successfully",
      data: updateForm,
    });
  } catch (err) {
    next(err);
  }
});
export default router;
