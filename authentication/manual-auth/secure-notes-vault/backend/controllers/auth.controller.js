import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import sessionModel from '../models/session.model.js';
import { randomUUID } from 'crypto';


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

        const deviceId = randomUUID();


        const refreshToken = jwt.sign({
            id: user._id,
            deviceId
        }, config.JWT_SECRET, { expiresIn: '7d' });


        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);


        const session = await sessionModel.create({
            user: user._id,
            deviceId,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });


        session.refreshTokenHash = refreshTokenHash;
        await session.save();


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


export async function login(req, res) {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const user = await userModel.findOne({ email });


        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const deviceId = randomUUID();


        const refreshToken = jwt.sign(
            { id: user._id,
                deviceId
             }, 
            config.JWT_SECRET, 
            { expiresIn: '7d' }
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);


        const session = await sessionModel.create({
            user: user._id,
            deviceId,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });


        const accessToken = jwt.sign(
            { id: user._id, session: session._id },
            config.JWT_SECRET,
            { expiresIn: '15m' }
        );


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        res.status(200).json({
            message: 'User logged in successfully',
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


export async function refreshToken(req, res) {
    try {

    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is not found' });
    }


        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);


        const session = await sessionModel.findOne({
            deviceId: decoded.deviceId,
            revoked: false
        });


        if (!session) {
            return res.status(401).json({ message: 'Session not found' });
        }


        const isMatch = await bcrypt.compare(refreshToken, session.refreshTokenHash);

        if (!isMatch) {
            session.revoked = true;
            await session.save();

            return res.status(401).json({ message: 'Invalid refresh token' });
        }


        const accessToken = jwt.sign({
            id: decoded.id,
            session: session._id
        }, config.JWT_SECRET, { expiresIn: '15m' }
        );


        const newRefreshToken = jwt.sign({
            id: decoded.id,
            deviceId: decoded.deviceId
        }, config.JWT_SECRET, { expiresIn: '7d' }
        );


        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

        
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });


        res.status(200).json({
            message: 'Access token refreshed successfully',
            accessToken
        });
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        return res.status(500).json({ message: error.message });
    }

}


export async function logout(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token is not found' });
        }


        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);


        const session = await sessionModel.findOne({
            deviceId: decoded.deviceId,
            revoked: false
        });

        if (!session) {
            return res.status(401).json({ message: 'Session not found' });
        }


        session.revoked = true;
        await session.save();

        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'User logged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export async function logoutAll(req, res) {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh Token is not found' });
        }

        const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

        await sessionModel.updateMany({
            user: decoded.id,
            revoked: false
        }, {
            revoked: true
        });

        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'All sessions logged out successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}