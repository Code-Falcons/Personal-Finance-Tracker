import bcrypt from "bcryptjs";
import Users from "../models/userModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;

    console.log("from auth register");

    if (!name || !email || !password || !currency) {
      const error = new Error("Please provide all required fields");
      error.status = 400;
      return next(error);
    }

    const existUser = await Users.findOne({ email });
    if (existUser) {
      const error = new Error("User already exists");
      error.status = 400;
      return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // new user
    const newUser = await Users.create({
      name,
      email,
      password: hashedPassword,
      currency,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        currency: newUser.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Please provide email and password");
      error.status = 400;
      return next(error);
    }

    const user = await Users.findOne({ email });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      return next(error);
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      tokens: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const error = new Error("No refresh token found");
      error.status = 401;
      return next(error);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          const error = new Error("Invalid or expired refresh token");
          error.status = 401;
          return next(error);
        }

        const user = await Users.findById(decoded.id);
        if (!user || !user.refreshTokens.includes(refreshToken)) {
          const error = new Error("Refresh token not found or invalidated");
          error.status = 403;
          return next(error);
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      const error = new Error("Refresh token is required");
      error.status = 400;
      return next(error);
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await Users.findById(decoded.id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    user.refreshTokens = user.refreshTokens.filter(
      (token) => token !== refreshToken
    );
    await user.save();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req, res, next) => {
  try {
    const email = req.user.email;

    console.log(email + "  from google login");

    const user = await Users.findOne({ email });
    if (!user) {
      return res.redirect("/api/auth/failure");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshTokens.push(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
