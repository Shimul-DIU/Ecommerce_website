import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from './model/adminModel.js';

dotenv.config();

const saltRounds = 10;

mongoose
  .connect(process.env.DB_URL || 'mongodb://localhost:27017/ecommerceDB')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const createAdmin = async () => {
  try {
    const hash = await bcrypt.hash(process.env.SECRET_KEY, saltRounds);

    await Admin.create({
      email: 'md.shimuldiu@gmail.com',
      password: hash,
      role: 'superadmin',
    });

    console.log('Admin created');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

createAdmin();