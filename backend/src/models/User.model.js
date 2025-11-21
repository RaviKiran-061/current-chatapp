import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilePic: {
        type: String,
        default: ''
    },
    rol: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);    
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);    
}

const User = model('User', userSchema);

export default User;