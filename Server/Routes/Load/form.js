import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { Form } from "../../Models/Form/Form.js";

const router = express.Router();

router.get("/get-form", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new Error("Unauthorized");

    const getForms = await Form.find({ userId: userId });
    if (!getForms) throw new Error("Forms not found");

    return res.status(200).json({ data: getForms });
  } catch (err) {
    next(err);
  }
});

router.get("/get-form/:formId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const formId = req.params.formId;
    if (!userId || !formId) throw new Error("unauthorized");

    const getForm = await Form.findById({ _id: formId });
    if (!getForm) throw new Error("Form not found");
    if (String(getForm.userId) !== String(userId)) {
      throw new Error("Forbidden");
    }
    return res.status(200).json({ data: getForm });
  } catch (err) {
    next(err);
  }
});

export default router;
