const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        trim: true
    },
    password:{
        type:String,
        required:true
    }, 
    role:{
        type:String,
        enum:["Admin","Student", "Visitor"]
        //here enum is taken because now the role is bouned and it can only take any of the data from the above three data.
    }
});

module.exports=mongoose.model("user", userSchema);