"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singIn = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const singIn = async (req, res, db) => {
    try {
        const { password, email } = req.body;
        const loginRowData = await db('login').select('email', 'has').where({ email: email });
        const passwordMatched = bcrypt_1.default.compareSync(password, loginRowData[0].has);
        try {
            if (passwordMatched) {
                const user = await db('users').select('*')
                    .where('email', email);
                res.json(user[0]);
            }
            else {
                res.json("There is no such user");
            }
        }
        catch (err) {
            res.status(400).json('400: /Signin internal user return error!');
        }
    }
    catch (err) {
        res.status(400).json('400: /Signin overall route error!');
    }
};
exports.singIn = singIn;
