import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema({
    building_floor: { type: String, required: true },
    lane1: { type: String, required: true },
    lane2: { type: String, default: '' },
    pincode: { type: String, required: true },
    landmark: { type: String, default: '' }
}, { _id: false });

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    mobile: { type: String, required: true },
    address: { type: addressSchema, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next;
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);