import { loginUser, registerUser } from '../db/users.js';
export async function handlerLogin(req, res) {
    const { username, password } = req.body;
    try {
        const user = await loginUser(username, password);
        res.send(user);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
export async function handlerRegister(req, res) {
    const { username, email, password } = req.body;
    try {
        const newUser = await registerUser({ username: username, email: email, password: password });
        res.send(newUser);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
export function handlerLogout(req, res) {
}
