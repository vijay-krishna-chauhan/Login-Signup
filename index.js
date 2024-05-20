const express=require('express');
const app=express();

require('dotenv').config();
const PORT= process.env.PORT || 4000;
//middleware
const cookieParser=require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const dbconnect=require("./config/database");
dbconnect();

//route import and mount
const user=require("./routes/user");
app.use("/api/v1", user);

app.listen(PORT,()=>{
    console.log(`port is running at ${PORT}`);
});