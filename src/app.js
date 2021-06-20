require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcrypt");

//this will keep eye on public folder things such as css file js fileor etc
app.use(express.static(path.join(__dirname, "../public")));

require("./db/conn");
const RegistredData = require("./models/registrationForm");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//here we are setting handlerbars
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "../src/page/common"));
app.set("views", "./src/page/views");

//accessing secret key
// console.log(process.env.SECRET_KEY);

//here we are rendering to different hbs page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
      const register = new RegistredData({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        dob: req.body.dob,
        password: req.body.password,
        cpassword: req.body.cpassword,
      });

      console.log(register);
      //token generation
      const token = await register.generateAuthToken();
      // console.log(token);

      //hashing
      const data = await register.save();
      console.log("final data" + data);
      res.status(201).render("index");
    } else {
      res.send("Password are not matching");
    }
  } catch (error) {
    res.status(400).send(`there is some mistake ${error}`);
  }
});

//login validation

// app.post("/login", async (req, res) => {
//   try {
//     const email = req.body.email;
//     const password = req.body.password;

//     const userEmail = await RegistredData.findOne({ email: email });
//     // res.send(userEmail.password);
//     // console.log(useremail);
//     // console.log(`${email}  and  ${password}`);

//     if (userEmail.password === password) {
//       res.status(201).render("index");
//     } else {
//       res.render("login");
//     }
//   } catch (error) {
//     res.status(400).send(` mistake  ${error}`);
//   }
// });

//after hashed

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userEmail = await RegistredData.findOne({ email: email });
    // res.send(userEmail.password);
    // console.log(useremail);
    // console.log(`${email}  and  ${password}`);

    // hashing
    const isMatch = await bcrypt.compare(password, userEmail.password);

    //token generation
    const token = await userEmail.generateAuthToken();
    // console.log(token);

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.render("login");
    }
  } catch (error) {
    res.status(400).send(` mistake  ${error}`);
  }
});

//json web token

// const jwt = require("jsonwebtoken");

// const createToken = async () => {
//   const res = await jwt.sign(
//     { _id: "12345" },
//     "ajajajajjajjahshdgfgfghfgdjhgfdfglsjdgflsjdhfgrybcjhhb",
//     { expiresIn: "2s" }
//   );
//   console.log(res);
//   const userverify = await jwt.verify(
//     res,
//     "ajajajajjajjahshdgfgfghfgdjhgfdfglsjdgflsjdhfgrybcjhhb"
//   );
//   console.log(userverify);
// };

// createToken();

app.listen(port, () => {
  console.log(`Listening to port number ${port} ...`);
});
