import { Schema, model } from "mongoose";
import jwr from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    avsatar: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    watchedVideos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  const token = jwr.sign(
    { id: this._id, email: this.email, name: this.username },
    process.env.JWT_AUTH_SECRET,
    {
      expiresIn: process.env.JWT_AUTH_EXPIRATION || "1h",
    }
  );
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwr.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d",
    }
  );
  this.refreshToken = refreshToken;
  return refreshToken;
};

export const User = model("User", userSchema);
