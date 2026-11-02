import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { signupValidation, loginValidation, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.post('/signup', signupValidation, handleValidationErrors, signup);
router.post('/login', loginValidation, handleValidationErrors, login);

export default router;