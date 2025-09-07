import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";

type User = {
    username: string,
    email: string,
    password: string,
}

export async function registerUser(user: User){
    validateUsername(user.username);
    validatePassword(user.password);

    const existingUser = await prisma.user.findFirst({
        where: {
            username: user.username,
        },
        select: {
            id: true,
        }
    });

    if (existingUser) {
        throw new Error('UserName already in use');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = prisma.user.create({
        data: {
            username: user.username,
            email: user.email,
            password: hashedPassword
        }
    })
    return (await newUser).username;
}

export async function loginUser(username: string, password: string) {
    validateUsername(username);
    validatePassword(password);

    const user = await prisma.user.findFirst({
        where: {
            username: username,
        },
    });
    if(!user) throw new Error("Username or password incorrect");

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) throw new Error("Username or password incorrect");

    return user.username;
}

function validateUsername(username: string){
    if (typeof username !== 'string') throw new Error('UserName must be a string');
    if (username.length < 3) throw new Error('UserName must be at least 3 characters long');
}

function validatePassword(password: string){
    if (typeof password !== 'string') throw new Error('Password must be a string');
    
    if (password.length < 6) throw new Error('Password must be at least 6 characters long');
    
    if (password.length > 128) throw new Error('Password must be less than 128 characters');
    
    if (!/[A-Z]/.test(password)) throw new Error('Password must contain at least one uppercase letter');
    
    if (!/[a-z]/.test(password)) throw new Error('Password must contain at least one lowercase letter');
    
    if (!/\d/.test(password)) throw new Error('Password must contain at least one number');
}