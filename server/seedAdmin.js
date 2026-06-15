const Admin = require("./model/adminModel");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
require('dotenv').config()

mongoose.connect(process.env.DB_URL||"mongodb://localhost:27017/ecommerceDB");

const createAdmin = async () => {
  const hash = await bcrypt.hash(process.env.SECRET_KEY, 10);

  await Admin.create({
    email: "md.shimuldiu@gmail.com",
    password: hash,
    role: "superadmin",
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
