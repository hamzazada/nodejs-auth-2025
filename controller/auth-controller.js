const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register Controller

const registerUser = async (req, res) => {
  try {
    //extract user information from our request body
    const { username, email, password, role } = req.body;

    // check if user is already in exists in our database
    const checkExistingUSer = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUSer) {
      return res.status(400).json({
        success: true,
        message: "user is already exists with same userName    or same email",
      });
    }

    // user Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // create a new user and saved in your database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    await newlyCreatedUser.save();
    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "user register successfully",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "unable to register user",
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong!k",
    });
  }
};

//Login Controller

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // find if the current user is exist in data base or not
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }
    //if the password is correct or not
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }
    // create your token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "45m",
      }
    );
    res.status(200).json({
      success: true,
      message: "Logged in Successful",
      accessToken,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "something went wrong!",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    //extract old and new password
    const { oldPassword, newPassword } = req.body;

    //find the current logged in user

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        success: false,
        message: "user not Found",
      });
    }
    // check if the old password is correct
    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "old password is not correct  please try again",
      });
    }

    // hash the new passowrd here
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update user password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed Successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong! please try again",
    });
  }
};

module.exports = { registerUser, loginUser , changePassword};
