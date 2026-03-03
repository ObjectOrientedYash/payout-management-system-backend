import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 400, 'Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 400, 'Invalid credentials');
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                return sendSuccess(res, 200, { token, user: payload }, 'Login successful');
            }
        );
    } catch (error) {
        console.error(error.message);
        return sendError(res, 500, 'Server error', error.message);
    }
};
