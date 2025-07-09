import { validatorcheck } from "../utils/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import client from "../database/redis.js";
import Submission from "../models/submission.js";
import { deleteImage, uploadImage } from "../utils/Cloudinary.js";
import path from "path";
export const register = async (req, res) => {
  try {
    validatorcheck(req.body);
    const { firstName, email, password } = req.body;

    // req.body.role = "user";
    // Check if the user already exists
    const existingUser = await User.findOne({ emailId: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName: firstName,
      emailId: email,
      password: hashedPassword, // Store the hashed password
      role: req.body.role,
      age: req.body.age,
      problemSolved: req.body.problemSolved,
      lastName: req.body.lastname,
    });
    await newUser.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // Set the token in the response header (optional)

    res.cookie("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        emailId: newUser.emailId,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in register controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    console.log(req.body);
    // Check if the user exists
    const user = await User.findOne({ emailId: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Check if the password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: user._id, email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    res.cookie("token", token, { maxAge: 3600000 });
    res.status(200).json({ message: "Login successful", token, user: reply });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // const payload = req.userInfo;
    const token = req.cookies.token;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(token, "token in logout");
    console.log("-------------------");
    console.log(payload, "payload in logout");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await client.set(`token:${token}`, "blocked");
    // Set the token in Redis with an expiration time (e.g., what is in the [payload exp])

    await client.expireAt(`token:${token}`, payload.exp);

    return res.cookie("token", null, { maxAge: 0 }).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminRegister = async (req, res) => {
  try {
    validatorcheck(req.body);
    const { firstname, email, password } = req.body;

    // Check if the user is an admin

    if (req.userInfo.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden you are not allowed to register as admin role",
      });
    }
    // console.log(req.userInfo, "userInfo in adminRegister controller");
    req.body.role = "admin";
    // Check if the user already exists
    const existingUser = await User.findOne({ emailId: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      firstName: firstname,
      emailId: email,
      password: hashedPassword, // Store the hashed password
      role: req.body.role,
      age: req.body.age,
      problemSolved: req.body.problemSolved,
      lastName: req.body.lastname,
    });
    await newUser.save();

    // Generate a JWT token for the user
    const token = jwt.sign(
      { id: newUser._id, role: "admin" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // Set the token in the response header (optional)

    res.cookie("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in register controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Find the user by ID
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in getProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    const deletedata = await User.findByIdAndDelete(userId);

    // submission delete
    await Submission.deleteMany(userId);

    res.status(200).json({
      success: true,
      message: "deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProfile controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userInfo._id;
    const updates = { ...req.body }; // include all text fields
    const profilePhoto = req.file;
    console.log("updatephotourl in edit profile", profilePhoto);
    // Fetch user first to perform checks and manage photo deletion
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Handle profile image upload if a file is included
    if (profilePhoto) {
      // Delete existing Cloudinary image
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0];
        await deleteImage(publicId);
      }

      // Normalize Windows path (if needed)
      const cloudResponse = await uploadImage(path.resolve(profilePhoto.path));
      updates.photoUrl = cloudResponse; // Add to updates
      console.log("updatephotourl in edit profile", cloudResponse);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile",
    });
  }
};

// 🔍 What is user._doc?
// When you use Mongoose to retrieve a document using methods like User.findOne() or User.findById(), the returned user is a Mongoose document, not a plain JavaScript object.

// This document includes:

// ✅ The actual data from your MongoDB collection.

// ⚙️ Additional Mongoose-specific methods and metadata.

// user._doc
// This gives you the plain object { name, email, password, ... }.
// const { password, ...userData } = user._doc;
// res.json({ user: userData });

// ### 🛡️ Cookie Security Flags (`httpOnly` & `secure`)

// - **`httpOnly: true`**
//   Prevents JavaScript from accessing the cookie on the client side.
//   ✅ Protects against **XSS (Cross-Site Scripting)** attacks.

// - **`secure: process.env.NODE_ENV === "production"`**
//   Ensures the cookie is sent only over **HTTPS** connections in production.
//   ✅ Protects against **MITM (Man-in-the-Middle)** attacks.

// > ✅ Use both flags when storing sensitive data like authentication tokens in cookies.
