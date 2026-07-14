import express from 'express';
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from '../controllers/applicationController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply/:id', isAuthenticated, applyJob);
router.get('/get', isAuthenticated, getAppliedJobs);
router.get('/:id/applicants', isAuthenticated, getApplicants);
router.put('/status/:id/update', isAuthenticated, updateStatus);

export default router;
