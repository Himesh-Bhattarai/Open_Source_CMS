import express from 'express';
import {validateCollection} from '../../Validation/Collection/Collection.js';
import {CollectionCheckpoint} from '../../../CheckPoint/Collection/Collection.js';

const router = express.Router();

router.post("/collection",
    validateCollection,
    CollectionCheckpoint
)

export default router;