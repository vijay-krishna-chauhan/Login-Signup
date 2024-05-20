const bcrypt=require("bcrypt");
const User=require("../models/User");
const jwt=require("jsonwebtoken");
const { options } = require("../routes/user");
require("dotenv").config();
exports.signup= async (req, res)=>{
    try{
        //get data
        const {name, email, password, role}=req.body;
        //check if user already exist
        const existingUser= await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password, 10);

            //here 10 is number of round
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"error in hashing",
            });
        }

        //create entry for user

        const user=await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User registered successfully",
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, please try again later"
        })
    }
}

exports.login= async (req, res)=>{
    try{
        //data fetch
        const {email, password}=req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"please fill all the fields correctly"
            })
        }

        //check for registered user
        //const user=await User.findOne({email});
        let user=await User.findOne({email});
        //if not registered
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }

        const payload={
            email:user.email,
            id:user._id,
            role: user.role,

        };

        // verify password and generate a jwt token
        if(await bcrypt.compare(password,user.password)){

            //if password matched
            let token=jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                }
            );
            //console.log(token);
            user=user.toObject();
            user.token=token; // in this token is added to the login db
            user.password=undefined; //password is removed from login db because if token and password is present together then it can be hacked easily.
            //It is not removed from the signup database .

            //cookies creation
            const options={
                //expires in from now to 3days after, 1000 is multiplied because the overall multiply is in milisecond
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User logged in successfully'
            });


        }else{
            //password doesn't match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect"
            })
        }
    }
    catch(err){
        console.log(err);
        console.error(err);
        return res.status(400).json({
            success:false,
            message:"Login failed"
        })
    }
}