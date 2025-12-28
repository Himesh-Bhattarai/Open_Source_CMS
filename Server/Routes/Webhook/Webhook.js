import express from 'express'
import { validateWebhook } from '../../Validation/Webhook/Webhooks.js';
import {webhookCheckpoint} from '../../CheckPoint/Webhook/Webhook.js';

const router = express.Router();

router.post("/webhook",
    validateWebhook,
    webhookCheckpoint
)

export default router