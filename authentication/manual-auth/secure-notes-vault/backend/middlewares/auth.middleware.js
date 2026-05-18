import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import sessionModel from '../models/session.model.js';
import userModel from '../models/user.model.js';


export async function protect(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }


    if (!token) {
            return res.status(401).json({ message: 'Unauthorized or token not found' });
    }

        try {

        const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);

        const session = await sessionModel.findById(decoded.session);

        if (!session) {
            return res.status(401).json({ message: 'Session not found' });
        }

        if (session.revoked) {
            return res.status(401).json({ message: 'Session revoked' });
        }

        const user = await userModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.session = session;
        next();
        }
        catch (error) {

            if (
                error.name === 'JsonWebTokenError' ||
                error.name === 'TokenExpiredError'
            ) {
                return res.status(401).json({ message: 'Unauthorized or token expired' });
            }
            return res.status(401).json({ message: 'Unauthorized' });
        }
};


export async function adminOnly(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Access denied' });
    }

    next();
};