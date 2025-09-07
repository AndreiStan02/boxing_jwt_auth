import express from "express";
import { handlerLogin, handlerLogout, handlerRegister } from "./api/auth.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1> Hola boxeador!!!<\h1>");
})

//AUTH
app.post('/api/login', (req, res, next) => {
    Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.post('/api/register', (req, res, next) => {
    Promise.resolve(handlerRegister(req, res)).catch(next);
});
app.post('/api/logout', (req, res, next) => {
    Promise.resolve(handlerLogout(req, res)).catch(next);
});

app.listen(PORT, () => {console.log(`Server started on ${PORT}`)});