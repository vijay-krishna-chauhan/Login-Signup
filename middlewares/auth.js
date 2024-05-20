const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req, res, next)=>{
    try{
        const token=req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        //console.log(token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token Missing",
            });
        }
        //verify the token
        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            req.user=payload;
        }catch(err){
            return res.status(401).json({
                success:false,
                message:"Token is Invalid",
            });
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token",
        });
    }
}

exports.isStudent=(req, res, next)=>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Student and you cannot access it",
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
}

exports.isAdmin=(req, res, next)=>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin and you cannot access it",
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
}