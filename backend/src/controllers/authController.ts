import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";

export const signup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      res.status(400).json({
        message: "User already exists",
      });

      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Signup Successful",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user: any = await User.findOne({
      email,
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid Credentials",
      });

      return;
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      res.status(400).json({
        message: "Invalid Credentials",
      });

      return;
    }

    const accessToken = generateAccessToken(
      user._id.toString()
    );

    const refreshToken = generateRefreshToken(
      user._id.toString()
    );

    user.refreshToken = refreshToken;

    await user.save();

    res.status(200).json({
      message: "Login Successful",
      accessToken,
      refreshToken,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};