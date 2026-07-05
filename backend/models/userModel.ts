import crypto from 'crypto';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { Model, model, models, Query, Schema } from 'mongoose';
import { IUser, IUserMethods } from '../types';

const userSchema = new Schema<IUser, Model<IUser>, IUserMethods>({
  firstname: {
    type: String,
    required: [true, 'Please provide your first name'],
    trim: true,
  },

  lastname: {
    type: String,
    required: [true, 'Please provide your last name'],
    trim: true,
  },

  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Please tell us your username!'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },

  // Cloudinary profile image URL
  photo: {
    type: String,
    default: '',
  },

  role: {
    type: String,
    enum: ['admin', 'developer'],
    default: 'admin',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },

  passwordChangedAt: Date,

  passwordResetToken: String,

  passwordResetExpires: Number,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre<IUser>('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);

  next();
});

userSchema.pre<Query<any, IUser>>(/^find/, function (next) {
  this.find({
    active: {
      $ne: false,
    },
  });

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User: Model<IUser, {}, IUserMethods> =
  models.User || model<IUser>('User', userSchema);

export default User;
