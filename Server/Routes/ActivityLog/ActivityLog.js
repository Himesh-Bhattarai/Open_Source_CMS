import express from 'express';
import { ActivityLogCheckpoint } from '../../../CheckPoint/ActivityLog/ActivityLog.js';
import { validateActivityLog } from '../../Validation/ActivityLog/ActivityLog.js';

const router = express.Router();

router.post("/activity-log",
    validateActivityLog,
    ActivityLogCheckpoint
)

export default router;