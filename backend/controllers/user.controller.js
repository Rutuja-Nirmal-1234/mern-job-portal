import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import path from "path";

export const register = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);

    let { fullname, email, phoneNumber, password, role } = req.body;

    fullname = fullname?.trim();
    email = email?.trim();
    role = role?.trim();
    password = password?.trim();

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const file = req.file;
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const logout = (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: "logout successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    // cloudinary file setup
    const file = req.file;

    let cloudResponse;

    if (file) {
      const fileUri = getDataUri(file);
      const fileName = path.parse(file.originalname).name;

      cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
        resource_type: "raw",
        public_id: fileName,
        use_filename: true,
        unique_filename: false,
      });
    }

    let skillsArray;

    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // update data

    if (fullname) {
      user.fullname = fullname;
    }

    if (email) {
      user.email = email;
    }

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (bio) {
      user.profile.bio = bio;
    }

    if (skills) {
      user.profile.skills = skillsArray;
    }

    // resume update

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;

      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    user = {
      _id: user._id,

      fullname: user.fullname,

      email: user.email,

      phoneNumber: user.phoneNumber,

      role: user.role,

      profile: user.profile,
    };

    return res.status(200).json({
      message: "profile updated successfully",

      user,

      success: true,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal Server Error",

      success: false,
    });
  }
};
