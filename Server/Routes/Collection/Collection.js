import express from 'express';
import { validateCollection } from '../../Validation/Collection/Collection.js';
import { collectionCheckpoint } from '../../CheckPoint/Collection/Collection.js';

const router = express.Router();

router.post("/collection",
    validateCollection,
    collectionCheckpoint
)

export default router;