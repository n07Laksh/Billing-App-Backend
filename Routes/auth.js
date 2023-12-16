const express = require("express");
const User = require("../Model/Users");
const Subscription = require("../Model/Subcription");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const axios = require("axios");
const getuser = require("../Middleware/getuser");
const secret_key = process.env.JWT_SECRET_KEY;

const {
  handlePCLogin,
  handleMobileLogin,
} = require("../UtilityFunctions/invoiceUtilityFunctions");

// router 1 for creating user using POST method and route /auth/signup no login require
router.post(
  "/signup",
  [
    // express validation requirement field
    body("name", "Please fill the name field").isLength({ min: 1 }),
    body("email", "please fill the email field").isEmail(),
    body("password", "Password minimum 6 character").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // express validation result
    const error = validationResult(req);
    // if error is accured then
    if (!error.isEmpty()) {
      return res.status(400).json({
        error: true,
        message: " Incomplete submissions may not be processed.",
      });
    }

    try {
      let user = await User.findOne({ email: req.body.email }).select(
        "-password -_id -__v -name"
      );
      if (user) {
        return res
          .status(400)
          .json({ error: true, message: " User Already Exists" });
      }

      const {
        name,
        password,
        email,
        deviceName,
        devicePlatform,
        deviceType,
        mobileDevice,
      } = req.body;

      // bcrypt password for security
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        deviceName: deviceName,
        devicePlatform: devicePlatform,
        deviceType: deviceType,
        mobileDevice: mobileDevice,
      });

      // Implement subscription logic here
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(startDate.getFullYear() + 1);
      // endDate.setMinutes(startDate.getMinutes() + 2); // Set the end date to one minute from the start date

      // Save the subscription information to the database or your preferred storage
      await Subscription.create({
        userId: user._id,
        startDate: startDate,
        endDate: endDate,
      });

      // jwt authentication
      const data = {
        user: {
          id: user._id,
        },
      };
      const jwtoken = jwt.sign(data, secret_key);

      return res.status(201).json({
        error: false,
        message: "User Created Successfully",
        user: jwtoken,
        data: user,
      });
    } catch (error) {
      return res
        .status(401)
        .json({ error: true, message: "Enternal Server Error" });
    }
  }
);

// //router 2 for getting/login user using POST method and route /auth/login no login require
router.post(
  "/login",
  [
    // express validation requirement field
    body("email", "Please fill the email field").isEmail(),
    body("password", "Password minimum 6 characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    // express validation result
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        error: true,
        message: " Incomplete submissions may not be processed.",
      });
    }

    const {
      email,
      password,
      deviceName,
      devicePlatform,
      deviceType,
      mobileDevice,
    } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        return res.status(400).json({
          error: true,
          message: "Please use the correct UserId and Password",
        });
      }

      // Check the user's subscription status
      const currentDate = new Date();
      const currentUtcDate = new Date(currentDate.toISOString());
      const subscription = await Subscription.findOne({ userId: user._id });

      // Convert subscription.endDate to a Date object in UTC
      const subscriptionEndDateUtc = new Date(subscription.endDate);

      if (!subscription || currentUtcDate >= subscriptionEndDateUtc) {
        return res
          .status(401)
          .json({
            error: true,
            message: "Subscription expired. Please renew your subscription.",
          });
      }

      // jwt authentication
      const data = {
        user: {
          id: user._id,
        },
      };
      const jwtoken = jwt.sign(data, secret_key);

      if (!mobileDevice && (deviceName || devicePlatform || deviceType)) {
        // Handle PC login
        const result = await handlePCLogin(
          user,
          deviceName,
          devicePlatform,
          deviceType
        );
        if (result) {
          return res.status(200).json({
            error: false,
            message: `Welcome Again Mr. ${user.name}`,
            user: jwtoken,
            data: user,
          });
        } else {
          return res
            .status(401)
            .json({
              error: true,
              message:
                "Access denied. Login from the original device is required.",
            });
        }
      } else if (mobileDevice) {
        const result = await handleMobileLogin(user, mobileDevice);
        if (result) {
          return res.status(200).json({
            error: false,
            message: `Welcome Again Mr. ${user.name}`,
            user: jwtoken,
            data: user,
          });
        } else {
          return res
            .status(401)
            .json({
              error: true,
              message:
                "Access denied. Login from the original device is required.",
            });
        }
      } else {
        return res
          .status(401)
          .json({
            error: true,
            message:
              "Access denied. Login from the original device is required.",
          });
      }
    } catch (error) {
      return res
        .status(401)
        .json({ error: true, message: "Enternal Server Error" });
    }
  }
);

//router 3 for getting/login user using POST method and route /auth/gstvalidation no login require
router.post("/gstvalidation", getuser, async (req, res) => {
  const body = req.body;
  const user = req.user;

  try {
    let updatedUser;

    const foundUser = await User.findById(user.id).select(
      "-password -_id -__v -name"
    );

    if (foundUser) {
      // Check if the user already has a GSTIN
      if (foundUser.GSTIN) {
        // Update the existing GSTIN
        foundUser.GSTIN = body.GSTIN; // Assuming "GSTIN" is the key in the request body
        updatedUser = await foundUser.save();
      } else {
        // Add new GSTIN to the user data
        foundUser.GSTIN = body.GSTIN; // Assuming "GSTIN" is the key in the request body
        updatedUser = await foundUser.save();
      }
      return res.status(200).json({
        error: false,
        message: "User updated or created successfully",
        user: updatedUser, // Send the updated or newly created user in the response
      });
    } else {
      // User not found, you may handle this case accordingly (return an error or perform necessary action)
      return res.status(404).json({ error: true, message: "User not found" });
    }

  } catch (error) {
    return res.status(400).json({ error: true, message: error });
  }
});

module.exports = router;
