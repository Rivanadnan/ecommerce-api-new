import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants/env';
export const verifyAccessToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    const accessToken = bearer && bearer.split(' ')[1];
    if (accessToken === undefined) {
        res.sendStatus(401);
        return;
    }
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (error, decoded) => {
        const user = decoded;
        if (error) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};
export const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken === undefined) {
        res.sendStatus(401);
        return;
    }
    jwt.verify(refreshToken, ACCESS_TOKEN_SECRET, (error, decoded) => {
        const user = decoded;
        if (error) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};
