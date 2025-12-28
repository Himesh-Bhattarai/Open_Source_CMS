import express from 'express'
import { validateFooterBlock } from '../../Validation/Footer/FooterBlock.js'
import { footerBlockCheckpoint } from '../../CheckPoint/Footer/FooterBlock.js'
const router = express.Router()

router.post("/footer-block",
    validateFooterBlock,
    footerBlockCheckpoint
)

export default router