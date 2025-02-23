import mongoose, { Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: 'String', unique: true, lowercase: true },
    password: {
      type: String,
      required: true,
      minlength: [8, 'too short user password'],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    loggedOutAt: Date,
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },


  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(7);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as { password?: string }; // Type assertion

  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(7);
      update.password = await bcrypt.hash(update.password, salt);
      this.setUpdate(update);
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});
