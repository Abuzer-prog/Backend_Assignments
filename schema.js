import Joi from 'joi';

export const signupSchema = Joi.object({
    name: Joi.string().trim().min(2).required(),
    username: Joi.string().trim().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    email: Joi.string().trim().lowercase().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    address: Joi.object({
        building_floor: Joi.string().trim().required(),
        lane1: Joi.string().trim().required(),
        lane2: Joi.string().trim().optional(),
        pincode: Joi.string().pattern(/^[0-9]{6}$/).required(),
        landmark: Joi.string().trim().optional()
    }).required(),
    password: Joi.string().trim().min(6).required(),
    repeat_password: Joi.string().trim().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match'
    })
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().trim().min(6).required(),
});