import { Request, Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import prisma from '../utils/prisma';

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
            };
        }
    }
}

interface DecodedToken {
    id: string;
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return res.status(500).json({ message: 'Server configuration error' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = { id: user.id };

        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: 'Token has expired' });
        }
        if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: 'Token is invalid' });
        }

        console.error('Authentication error:', error);
        return res.status(500).json({ message: 'Authentication failed' });
    }
};
