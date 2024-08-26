require("dotenv").config()
const express=require("express");
const session=require("express-session")
const mongoose=require("mongoose")
const multer=require("multer")
const path=require("path")

const app=express()

const PORT=process.env.PORT||5000 




//setup 
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//middleware
app.use(
    session({
        secret:"my-secret-key",
        resave:false,
        saveUninitialized:true
    })
)
//session start
mongoose.connect(process.env.URI)
.then(()=>{console.log("server started");})
.catch((err)=>(console.log((err.stack))))

app.set('view engine', 'ejs');

const Routes=require("./Routes/Route")
app.use("/",Routes)


app.listen(PORT,()=>{console.log(`server is running at http://localhost:${PORT}`);})