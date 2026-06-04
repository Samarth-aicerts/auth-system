import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import transporter from "../utils/sendEmail";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";

// SIGNUP
export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    // NAME VALIDATION
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    // EMAIL VALIDATION
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Please enter valid email",
      });
    }

    // PASSWORD VALIDATION
    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    // CHECK USER
    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
const hashedPassword = await bcrypt.hash(
  password,
  10
);

// GENERATE OTP
const otp = Math.floor(
  100000 + Math.random() * 900000
).toString();

// SEND OTP
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Signup OTP",
  text: `Your signup OTP is ${otp}`,
});

// CREATE USER
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  otp,
  otpExpire: new Date(
    Date.now() + 5 * 60 * 1000
  ),
});

res.status(201).json({
  success: true,
  message: "OTP sent successfully",
  email,
});

  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and Password are required",
      });
    }

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // GENERATE OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;

    user.otpExpire = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await user.save();

    console.log("Sending OTP...");

    // SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}`,
    });

    console.log("OTP Sent");

    // RESPONSE
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      email: user.email,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY OTP
export const verifyOtp = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp } = req.body;

    // VALIDATION
    if (!email || !otp) {
      return res.status(400).json({
        message: "OTP and Email required",
      });
    }

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // CHECK OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // CHECK OTP EXPIRE
    if (
      user.otpExpire &&
      user.otpExpire < new Date()
    ) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    // GENERATE TOKEN
    const accessToken = generateAccessToken(
      user._id.toString()
    );

    // CLEAR OTP
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    // RESPONSE
    res.status(200).json({
      success: true,
      message: "OTP Verified",
      accessToken,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};