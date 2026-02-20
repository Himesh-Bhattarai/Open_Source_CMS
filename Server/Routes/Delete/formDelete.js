import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Form } from "../../Models/Form/Form.js";
import {cmsEventService as notif} from "../../Services/notificationServices.js"

const router = express.Router();

router.delete("/form/:formId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const formId = req.params.formId;
    if (!userId || !formId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    if (String(form.userId) !== String(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deleteForm = await Form.findByIdAndDelete(formId);

    notif.deleteForm({
      userId,
      formName: form.name,
      formId: form._id,
      websiteId: form.tenantId,
    });

    return res
      .status(200)
      .json({ message: "Form Deleted Successfully", data: deleteForm });
  } catch (err) {
    next(err);
  }
});

export default router;
