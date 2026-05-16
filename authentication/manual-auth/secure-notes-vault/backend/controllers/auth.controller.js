import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import sessionModel from '../models/session.model.js';


export async function register(req, res) {
    try {
        const { username, email, password, role } = req.body;


        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { username },
                { email }
            ]
        });


        if (isAlreadyRegistered) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            role
        });


        const refreshToken = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, { expiresIn: '7d' });


        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);


        const session = await sessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });


        const accessToken = jwt.sign({
            id: user._id,
            session: session._id
        }, config.JWT_SECRET, { expiresIn: '15m' }
        );


        res.cookie('refreshToken', refreshToken, {
            httpOnly:  true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        

        res.status(201).json({
            message: 'User registered successfullly',
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });
        
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}