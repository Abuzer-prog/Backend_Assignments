import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    jobId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    qualification: { type: String, required: true },
    skills: [{ type: String, required: true }],
    resume: { type: String, required: true },
    photo: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected', 'Withdrawn'], 
        default: 'Pending' 
    }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);