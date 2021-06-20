const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registrationform = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//token generation
registrationform.methods.generateAuthToken = async function () {
  try {
    // console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(token);
    return token;
  } catch (error) {
    res.send("the error part " + error);
    console.log("error part " + error);
  }
};

//hashing data
// registrationform.pre("save", async function (next) {
//   // const passwordHasing = await bycrypt.hash(password, 10);
//   this.password = await bycrypt.hash(this.password, 10);
//   this.cpassword = undefined;
//   next();
// });

registrationform.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bycrypt.hash(this.password, 10);
    this.cpassword = await bycrypt.hash(this.password, 10);
  }
  next();
});

const RegistredData = new mongoose.model("RegistredData", registrationform);
module.exports = RegistredData;
