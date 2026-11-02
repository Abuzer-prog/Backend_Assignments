import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((error) => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
};

export const signupValidation = [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must contain at least 2 characters'),
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
    body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('mobile').matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
    body('address.building_floor').trim().notEmpty().withMessage('Building/Floor is required'),
    body('address.lane1').trim().notEmpty().withMessage('Lane1 is required'),
    body('address.lane2').trim().optional(),
    body('address.pincode').matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
    body('address.landmark').trim().optional(),
    body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
];

export const loginValidation = [
    body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters')
];