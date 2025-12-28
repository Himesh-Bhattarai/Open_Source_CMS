import express from 'express';
import { validateField } from '../../Validation/Field/Field.js';
import { fieldCheckPoint } from '../../CheckPoint/Field/Field/Field.js';
import { validateContentType } from '../../Validation/Field/ContentType.js';
import { contentTypeCheckpoint } from '../../CheckPoint/Field/ContentType/ContentType.js';


const router = express.Router();

router.post("/field",
    validateField,
    fieldCheckPoint
)

router.post("/content-type",
    validateContentType,
    contentTypeCheckpoint
)

export default router;