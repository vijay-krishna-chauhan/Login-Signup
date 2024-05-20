const express=require("express");
const router=express.Router();

const {login,signup}=require("../controllers/Auth");
const {auth, isStudent, isAdmin}=require("../middlewares/auth");

router.post("/login",login);
router.post("/signup",signup);

//protected route
router.get("/test", auth, (req,res)=>{
    res.json({
        success:true,
        message:'Welocme to the protected route for Test',
    });
});

router.get("/student", auth, isStudent, (req,res)=>{
    res.json({
        success:true,
        message:'Welocme to the protected route for Student',
    });
});

router.get("/admin", auth, isAdmin, (req,res)=>{
    res.json({
        success:true,
        message:'Welocme to the protected route for Admin',
    });
});
module.exports=router;