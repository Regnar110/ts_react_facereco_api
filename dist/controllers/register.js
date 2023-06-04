"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const register = async (req, res, db) => {
    console.log(req);
    const { name, email, password } = req.body;
    const hashedPass = bcrypt_1.default.hashSync(password, 10);
    try {
        await db.transaction(async (trx) => {
            const loginEmail = await trx('login')
                .insert({
                has: hashedPass,
                email: email
            })
                .returning('email');
            const user = await trx('users').returning('*').insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            });
            res.json(user[0]);
            console.log(user);
        });
    }
    catch (err) {
        res.status(400).json("/register route path overall error!");
    }
};
exports.register = register;
