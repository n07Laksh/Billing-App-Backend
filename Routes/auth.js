const express = require("express");
const User = require("../Model/Users");
const Subscription = require("../Model/Subcription");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const router = express.Router();

const secret_key = process.env.JWT_SECRET_KEY;

// router 1 for creating user using POST method and route /auth/signup no login require
router.post("/signup", [
    // express validation requirement field
    body("name", "Please fill the name field").isLength({ min: 1 }),
    body("email", "please fill the email field").isEmail(),
    body("password", "Password minimum 6 character").isLength({ min: 6 }),
], async (req, res) => {

    // express validation result
    const error = validationResult(req)
    // if error is accured then
    if (!error.isEmpty()) {
        return res.status(400).json({ error: true, message: " Incomplete submissions may not be processed." });
    }

    try {
        let user = await User.findOne({ email: req.body.email }).select("-password -_id -__v -name")
        if (user) { return res.status(400).json({ error: true, message: " User Already Exists" }) }

        const { name, password, email, deviceName, devicePlatform, deviceType } = req.body;

        // bcrypt password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            deviceName: deviceName,
            devicePlatform: devicePlatform,
            deviceType: deviceType
        })

        // Implement subscription logic here
        // For example, create a subscription for the user:
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(startDate.getFullYear() + 1);
        // endDate.setMinutes(startDate.getMinutes() + 2); // Set the end date to one minute from the start date

        // Save the subscription information to the database or your preferred storage
        await Subscription.create({
            userId: user._id,
            startDate: startDate,
            endDate: endDate
        });


        // jwt authentication
        const data = {
            user: {
                id: user._id,
            }
        }
        const jwtoken = jwt.sign(data, secret_key);

        return res.status(201).json({ error: false, message: "User Created Successfully", user: jwtoken, data: user })

    } catch (error) {
        return res.status(401).json({ error: true, message: "Enternal Server Error" })
    }

});











//router 2 for getting/login user using POST method and route /auth/login no login require
router.post("/login", [
    // express validation requirement field
    body("email", "Please fill the email field").isEmail(),
    body("password", "Password minimum 6 characters").isLength({ min: 6 }),
], async (req, res) => {
    // express validation result
    const error = validationResult(req);
    // if error is occurred then
    if (!error.isEmpty()) {
        return res.status(400).json({ error: true, message: " Incomplete submissions may not be processed." });
    }

    try {
        const { email, password, deviceName, devicePlatform, deviceType } = req.body;

        let user = await User.findOne({ email: email }).select(" -__v");
        // console.log(user);
        // if user not exist in the database
        if (!user) {
            return res.status(500).json({ error: true, message: "Please use the correct UserId and Password" });
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return res.status(400).json({ error: true, message: "Please use the correct UserId and Password" });
        }

        // Check the user's subscription status
        const currentDate = new Date();
        const currentUtcDate = new Date(currentDate.toISOString());
        const subscription = await Subscription.findOne({ userId: user._id });

        // Convert subscription.endDate to a Date object in UTC
        const subscriptionEndDateUtc = new Date(subscription.endDate);

        if (!subscription || currentUtcDate >= subscriptionEndDateUtc) {
            // Handle the case where the user does not have a valid subscription
            return res.status(401).json({ error: true, message: "Subscription expired. Please renew your subscription." });
        }

        // Now, check the device identity
        // if (
        //     user.deviceName !== deviceName ||
        //     user.devicePlatform !== devicePlatform ||
        //     user.deviceType !== deviceType
        // ) {
        //     return res.status(401).json({ error: true, message: "You Can Only Use This User Id in One Device" });
        // }

        // jwt authentication
        const data = {
            user: {
                id: user._id,
            }
        }
        const jwtoken = jwt.sign(data, secret_key);

        return res.status(201).json({ error: false, message: `Welcome Again Mr. ${user.name}`, user: jwtoken, data: user });

    } catch (error) {
        return res.status(400).json({ error: true, message:"Enternal Server Error" });
    }
});



module.exports = router;
