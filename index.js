import express from "express";
import bodyParser from  "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = 3000;

const { Pool } = pg;

const pool = new  Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized :false,
    },
});

export default pool;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

var actual_user= "";
var actual_email="";


app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/home",(req,res)=>{
    res.render("home.ejs",{user:actual_user});
});
app.get("/signin",(req,res)=>{
    res.render("signinoptions.ejs");
});
app.get("/signincustomer",(req,res)=>{
    res.render("signup.ejs");
});
app.get("/signinworker",(req,res)=>{
    res.render("signupworker.ejs");
});
app.get("/login",(req,res)=>{
    res.render("login.ejs")
});
app.get("/products",(req,res)=>{
    res.render("products.ejs");
});
app.get("/community",(req,res)=>{
    res.render("community.ejs");
});
app.get("/resources",(req,res)=>{
    res.render("resources.ejs");
});
app.get("/aboutus",(req,res)=>{
    res.render("about.ejs");
})
app.get("/solution",(req,res)=>{
    res.render("solution.ejs");
});
app.get("/user_home",(req,res)=>{
    res.render("user_home.ejs",{user:actual_user});
});
app.get("/userhome",(req,res)=>{
    res.render("user_home.ejs");
});
app.get('/booking-success', (req, res) => {
    res.render("booking-success.ejs"); 
});
app.get("/profile",async (req,res)=>{
    const result = await pool.query("select * from users where username = $1",[actual_user]);
    const user = result.rows[0];
    console.log(user);
    const address1= user.address;
    const mail1 = user.email;
    res.render("profile.ejs",{user1:actual_user,address: address1,mail: mail1});
});
app.get("/gardener",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from gardener");
        const gardeners = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("gardener.ejs",{gardener : gardeners});
        }
        else{   
            res.send("No gardener nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/carpenter",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from carpenter");
        const carpenters = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("carpenter.ejs",{carpenter : carpenters});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/keeper",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from housekeeping");
        const keepers = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("housekeeper.ejs",{keeper: keepers});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/cleaner",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from cleaner");
        const cleaners = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("cleaner.ejs",{cleaner: cleaners});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/electrician",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from electricain");
        const electricains = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("electrician.ejs",{electricain : electricains});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.get("/tvrepair",async (req,res)=>{
    try{
        const checkResult = await pool.query("select * from tvrepair");
        const tvrepairs = checkResult.rows;
        if(checkResult.rows.length>0){
            res.render("tvrepair.ejs",{tvrepair: tvrepairs});
        }
        else{
            res.send("No carpenters nearby");
        }
    }
    catch(err){
        console.log(err);
    }
});
app.post("/register", async (req,res)=>{
    const email  = req.body.email;
    actual_email= email;
    const name = req.body.username;
    const address = req.body.address;
    const password = req.body.password;
    try{
        const checkResult = await pool.query("select * from users where username = $1",[name]);
        if(checkResult.rows.length>0){  
            return res.send("user already exists");
        }
        else{
            await pool.query("insert into users (email,username,address,password) values ($1,$2,$3,$4)",[email,name,address,password]);
            return res.send("registration successfull");
        }
    }
    catch(err){ 
        console.log(err);
    }
});
app.post("/login", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        const checkResult = await pool.query("select * from users where username = $1",[username]);
        if(checkResult.rows.length<0){
            res.send("user doesn't not exits please register before login");
        }
        else{
            const user = checkResult.rows[0];
            const storedPassword = user.password;
            const user_email = user.email;
            const address1  = user.address;
            actual_email = user_email;
            if(storedPassword==password){
                actual_user = username;
                res.render("user_home.ejs",{user:username,address:address1,userMail:user_email});
            }
            else{
                res.send("invalid password");
            }
        }
    }
    catch(err){
        console.log(err);
    }
});
app.listen(port,()=>{
    console.log(`server running on port ${3000}`);
});

app.use(express.json()); // make sure this is enabled to parse JSON

app.post("/book", async (req, res) => {
  try {
    const { workerName, workerPhone, workerPlace, workerType } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'quickfixwebsite12@gmail.com',
        pass: 'mjjl nakr jzlj xhgo'
      }
    });

    const mailOptions = {
      from: actual_email,
      to: 'quickfixwebsite12@gmail.com',
      subject: 'New Booking Request - QuickFix',
      html: `
        <div style="font-family:sans-serif; padding: 20px;">
          <h3>📥 New Booking Request</h3>
          <p><strong>User:</strong> ${actual_user}</p>
          <p><strong>Email:</strong> ${actual_email}</p>
          <p><strong>Worker Type:</strong> ${workerType}</p>
          <p><strong>Worker Name:</strong> ${workerName}</p>
          <p><strong>Location:</strong> ${workerPlace}</p>
          <p><strong>Phone:</strong> ${workerPhone}</p>
          <br>
          <p>Thank you,<br><strong>Team QuickFix</strong></p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Booking email sent:', info.response);

    res.status(200).send("Mail sent");
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).send("Mail sending failed");
  }
});
