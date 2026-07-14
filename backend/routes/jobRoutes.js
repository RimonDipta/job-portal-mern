import express from 'express';
import { postJob, getAllJobs, getJobById, getAdminJobs, updateJob, deleteJob } from '../controllers/jobController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.post('/post', isAuthenticated, postJob);
router.get('/get', getAllJobs); // Open for candidates / visitors
router.get('/getadminjobs', isAuthenticated, getAdminJobs);
router.get('/get/:id', getJobById);
router.put('/update/:id', isAuthenticated, updateJob);
router.delete('/delete/:id', isAuthenticated, deleteJob);

export default router;
