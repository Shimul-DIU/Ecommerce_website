import users from '../model/userModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const saltRounds = 10;

// ================= CREATE USER =================
export const createUser = async (req, res) => {
  try {
    const { fullname, email, password, confirmPassword } = req.body;

    const fields = { fullname, email, password, confirmPassword };

    for (let [key, value] of Object.entries(fields)) {
      if (!value) {
        return res.status(400).json({
          error: { [key]: `${key} is required` },
        });
      }
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        error: {
          confirmPassword: 'Password not matched',
        },
      });
    }

    const existingUser = await users.findOne({ email }).select('+password');

    if (existingUser) {
      return res.status(400).json({
        error: {
          email: 'Email is already registered',
        },
      });
    }

    const hashpassword = await bcrypt.hash(password, saltRounds);

    const user = new users({
      fullname,
      email,
      password: hashpassword,
    });

    await user.save();

    return res.status(200).json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// ================= LOGIN USER =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    if (!password) {
      return res.status(400).json({
        message: 'Password is required',
      });
    }

    const user = await users.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '200d',
    });

    return res.status(200).json({
      message: 'Login successful',
      token: 'Bearer ' + token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};