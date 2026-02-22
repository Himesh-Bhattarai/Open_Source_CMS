import { Form } from "../Models/Form/Form.js";

export const getForm = async (req, res, next) => {
  try {
    const tenantId = req.tenant?._id?.toString();
    if (!tenantId) {
      return res.status(400).json({ error: "Tenant context is required" });
    }

    const form = await Form.findOne({
      tenantId,
      status: "published",
    }).lean();

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    return res.status(200).json({
      form,
    });
  } catch (err) {
    next(err);
  }
};
