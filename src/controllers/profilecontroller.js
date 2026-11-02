import Profile from '../models/profile.js';
import fs from 'fs';

// Create Job Profile
export const createProfile = async (req, res, next) => {
    try {
        const { qualification, skills, email } = req.body;
        const resume = req.files?.resume?.[0]?.path;
        const photo = req.files?.photo?.[0]?.path;

        if (!resume || !photo) {
            return res.status(400).json({ success: false, message: 'Both Resume and Photo are required' });
        }

        const jobId = `JOB-${Date.now()}`;
        const profile = await Profile.create({
            jobId,
            email,
            qualification,
            skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
            resume,
            photo
        });

        return res.status(201).json({
            success: true,
            message: 'Job profile created successfully',
            jobId,
            profile
        });
    } catch (error) {
        next(error);
    }
};

// Delete Job Profile & remove attached files from disk
export const deleteProfile = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: 'jobId is required' });
        }

        const profile = await Profile.findOne({ jobId });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Job profile not found' });
        }

        // Clean up uploads/ files
        if (profile.resume && fs.existsSync(profile.resume)) fs.unlinkSync(profile.resume);
        if (profile.photo && fs.existsSync(profile.photo)) fs.unlinkSync(profile.photo);

        await Profile.deleteOne({ jobId });

        return res.status(200).json({ success: true, message: 'Job profile deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Get Application Status
export const getApplicationStatus = async (req, res, next) => {
    try {
        const { jobId } = req.query;

        if (!jobId) {
            return res.status(400).json({ success: false, message: 'jobId query parameter is required' });
        }

        const profile = await Profile.findOne({ jobId });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Application details fetched successfully',
            status: profile.status,
            application: profile
        });
    } catch (error) {
        next(error);
    }
};

// Withdraw Application
export const withdrawApplication = async (req, res, next) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ success: false, message: 'jobId is required' });
        }

        const profile = await Profile.findOneAndUpdate(
            { jobId },
            { status: 'Withdrawn' },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully',
            status: profile.status
        });
    } catch (error) {
        next(error);
    }
};