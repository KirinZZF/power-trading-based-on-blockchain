import express from 'express'
const router = express.Router()
import {generateCert,redeemCert,getCertByCertNo,getAllCert} from '../controllers/certController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/:email').get(getAllCert)
router.route('/generate').post(generateCert)
router.route('/:certno').get(getCertByCertNo)
router.route('/redeem').post(redeemCert)
export default router