const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  // If the user doesn't enter any of the fields , throw an error.
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  // If the user already exists in the database , still throw an error.
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create a new user in the database.
  // I also want JWT token to be sent to the user.
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Create the User");
  }
});

// This function authorizes the user to login in the website.
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // If the user exists in the database.
  if (user && (await user.comparePassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// /api/user/search=piyush.
const getAllUsers = asyncHandler(async (req, res) => {
  // If you want to pick up the query from the url , we use req.query.(name of the query).
  // If it wants something like id or params , we would use req.params.

  // This is or condition is mongodb.
  // regrex --> helps in pattern matching string in queries.
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  // Find all the users details except the current user + the current user
  // can have info on all other users if it is authorized
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // console.log(users);
  res.send(users);
});

module.exports = { registerUser, authUser, getAllUsers };
