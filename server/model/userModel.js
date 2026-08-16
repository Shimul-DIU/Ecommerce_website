// model/userModel.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
      required: function () {
        return this.provider === 'local';
      },
    },

    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },

    firebaseId: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    avatar: {
      type: String,
      default: '',
      match: [/^https?:\/\/.+/, 'Avatar must be a valid URL'],
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model('users', userSchema);

export default Users;