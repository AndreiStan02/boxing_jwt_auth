import prisma from "./prismaClient.js";
import bcrypt from "bcrypt";

export async function loginUser(username: string, password: string) {
    const user = await prisma.user.findFirst({
        where: {
            username: username,
        },
    });
    if(!user) throw new Error("Username or password incorrect");

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) throw new Error("Username or password incorrect");

    const {password: _, ...publicUser} = user;

    return publicUser;
}