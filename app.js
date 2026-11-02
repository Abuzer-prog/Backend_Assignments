// /* Write a Express code for login & Signup Page. 
// For Login, the details contain Email and Password 
// For Signup, the details required - 
// 1.Name 
// 2.Username 
// 3.Gender 
// 4.Mobile 
// 5.Address with Proper inputs i.e, Building/Floor, Lane1, Lane2(optional), Pincode, Landmark(optional)
// 6. Password 
// 7. Confirm Password 
// Using Express.js and MongoDB and Password hashing and modular code is mandatory

// Using the current signup Details - Create a job profile by creating a new job id
// Routes 
// /create-profile - creates a job profile by taking the Qualification and the skills as well as the Resume and photo using multer
// /delete-profile - deletes the job profile 
// /application - shows the status of the job application
// /withdraw-application - withdraws the application for the job*/

// import express from 'express';
// import { body, validationResult } from 'express-validator';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();

// mongoose.connect(process.env.MONGO_URI) //abuzercooloop786@gmail.com
// .then(() => {
//     console.log('Connected to MongoDB');    
// })
// .catch((err) => {
//     console.error('Error connecting to MongoDB', err);
// });


// const app = express();
// app.use(express.json());

// const handleValidationErrors = (req, res, next) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//         return res.status(400).json({success: false,errors: errors.array().map((error) => ({
//                 field: error.path,
//                 message: error.msg
//             }))
//         });
//     }

//     next();
// };

// const signupValidation = [
//     body('name').trim().isLength({ min: 2 }).withMessage('Name must contain at least 2 characters'),
//     body('username').trim().notEmpty().withMessage('Username is required'),
//     body('gender').isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
//     body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
//     body('mobile').matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
//     body('address.building_floor').trim().notEmpty().withMessage('Building/Floor is required'),
//     body('address.lane1').trim().notEmpty().withMessage('Lane1 is required'),
//     body('address.lane2').trim().optional(),
//     body('address.pincode').matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
//     body('address.landmark').trim().optional(),
//     body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters'),
//     body('repeat_password').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
// ];

// const loginValidation = [
//     body('email').trim().isEmail().withMessage('Enter a valid email address').normalizeEmail(),
//     body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters')
// ];

// app.get('/', (req, res) => {
//     res.status(200).json({success: true,message: 'Welcome to the Login & Signup API'});
// });
// app.post('/create-profile', async (req, res, next) => {
//     try {
//         const { qualification, skills } = req.body;
//         return res.status(201).json({success: true,message: 'Job profile created successfully',profile: { qualification, skills }});
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/delete-profile', async (req, res, next) => {
//     try {
//         const { profileId } = req.body;
//         return res.status(200).json({success: true,message: 'Job profile deleted successfully'});
//     } catch (error) {
//         next(error);
//     }
// });

// app.get('/application', async (req, res, next) => {
//     try {
//         const { applicationId } = req.query;
//         return res.status(200).json({success: true,message: 'Application details fetched successfully',application: { applicationId }});
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/withdraw-application', async (req, res, next) => {
//     try {
//         const { applicationId } = req.body; 
//         return res.status(200).json({success: true,message: 'Application withdrawn successfully'});
//     } catch (error) {
//         next(error);
//     }
// });

// app.post('/signup',signupValidation,handleValidationErrors,async (req, res, next) => {
//         try {const { name, email, password, gender } = req.body;
//             return res.status(201).json({success: true,message: 'User signed up successfully',user: { name, email, gender }});
//         } catch (error) {
//             next(error);
//         }
//     }
// );

// app.post('/login',loginValidation,handleValidationErrors,async (req, res, next) => {
//         try {const { email, password } = req.body;
//             return res.status(200).json({success: true,message: 'Login validation successful',user: { email }});
//         } catch (error) {
//             next(error);
//         }
//     }
// );

// app.use((req, res) => {
//     res.status(404).json({success: false,message: 'Route not found'});
// });

// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({success: false,message: 'Internal server error'
//     });
// });

// const PORT = 3000;

// export default app;

// // app.listen(PORT, () => {
// //     console.log(`Server is running on port ${PORT}`);
// // });



import express from 'express';
import fs from 'fs';
import path from 'path';
import { requestLogger } from './src/middleware/requestlogger.js';
import authRoutes from './src/routes/authRoutes.js';
import profileRoutes from './src/routes/profileRoutes.js';

const app = express();

app.use(express.json());

// Attach Request Logger Middleware
app.use(requestLogger);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 1. Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: `${process.uptime().toFixed(2)}s`
    });
});

// 2. View Logs Endpoint
app.get('/logs', (req, res) => {
    const logFilePath = path.join(process.cwd(), 'logs', 'app.log');

    if (!fs.existsSync(logFilePath)) {
        return res.status(200).json({
            success: true,
            logs: []
        });
    }

    // Read log file lines
    const logData = fs.readFileSync(logFilePath, 'utf-8');
    const logs = logData
        .trim()
        .split('\n')
        .filter(line => line.length > 0);

    return res.status(200).json({
        success: true,
        totalLogs: logs.length,
        logs
    });
});
// Existing routes
app.use('/', authRoutes);
app.use('/', profileRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

export default app;