import express from 'express';
// 1. Include all required controller methods in named imports
import { 
    createProfile, 
    deleteProfile, 
    getApplicationStatus, 
    withdrawApplication 
} from '../controllers/profileController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// 2. Define routes matching assignment requirements
router.post(
    '/create-profile', 
    upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'photo', maxCount: 1 }]), 
    createProfile
);
router.post('/delete-profile', deleteProfile);
router.get('/application', getApplicationStatus);
router.post('/withdraw-application', withdrawApplication);

export default router;