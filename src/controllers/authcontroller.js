import User from '../models/user.js';

export const signup = async (req, res, next) => {
    try {
        const { name, username, gender, email, mobile, address, password } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email or Username already exists' });
        }

        const user = await User.create({
            name,
            username,
            gender,
            email,
            mobile,
            address,
            password
        });

        return res.status(201).json({
            success: true,
            message: 'User signed up successfully',
            user: { id: user._id, name: user.name, email: user.email, username: user.username }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        next(error);
    }
};