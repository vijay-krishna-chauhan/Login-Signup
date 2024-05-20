const mongoose=require("mongoose");
require("dotenv").config();
const dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: false
    })
    .then(()=>console.log("DB is connected"))
    .catch((e)=>{
        console.log("Issue in db");
        console.log(e.message);
        process.exit(1);
    });
}
module.exports=dbConnect;