import { Request, Response } from 'express';
import { loginUser, registerUser } from '../db/users.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/constants/env.js';

process.loadEnvFile();

export async function handlerLogin(req: Request, res: Response) {
    const {username, password} = req.body;
    try {
        const user = await loginUser(username, password);
        const token = jwt.sign({id: user.id, username: user.username}, JWT_SECRET, {expiresIn: '1h'});
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60
        }).send(user);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
}

export async function handlerRegister(req: Request, res: Response) {
    const {username, email, password} = req.body;
    try{
        const newUser = await registerUser({username: username, email: email, password: password});
        res.send(newUser);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
}

export function handlerLogout(req: Request, res: Response) {
    
}