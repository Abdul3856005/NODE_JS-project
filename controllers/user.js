import User from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";



export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
 
    if(!isMatch)return next(new ErrorHandler("Invalid Email or Password",404));


    // Assuming sendCookie is a function you've defined elsewhere
    sendCookie(user, res, `Welcome ${user.name}`, 200);
  } catch (error) {
    // Handle any errors that may occur during the process
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if ( password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  let user = await User.findOne({ email });

 
  if(user)return next(new ErrorHandler("User already Exists",404));


  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  sendCookie(user, res, "Registered Successfully", 201);
};

export const getmyProfile =(req, res) => {

 

  res.status(200).json({
    success: true,
    user: req.user,
  });

};


export const logout = (req, res) =>{
  res
  .status(200)
  .cookie("token", "", {
    expires:new Date(Date.now()),
    sameSite:process.env.NODE_ENV ==="Development"? "lax" :"none",
    secure: process.env.NODE_ENV ==="Development"? false :true,   
  })
  .json({
        success:true,
      message : "Logout Successfully"
        user: req.user,
  });

};


