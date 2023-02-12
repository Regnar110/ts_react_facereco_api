"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("knex");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const faceRecognition_1 = require("./utils/faceRecognition");
const config = {
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: '587188Ab',
        database: 'smartbrain'
    }
};
const db = (0, knex_1.knex)(config); // knex INIT
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json('get connection');
});
app.post("/signin", (req, res) => {
    const { password, email } = req.body;
    db.select('email', 'has').from('login')
        .where({ email: email })
        .then(data => {
        const passwordMatched = bcrypt_1.default.compareSync(password, data[0].has);
        if (passwordMatched) {
            return db.select('*').from('users')
                .where('email', email)
                .then(user => {
                res.json(user[0]);
            })
                .catch(err => res.json('sign in passwordMatch db select error'));
        }
        else {
            res.json("wron email or password");
        }
    }).catch(err => res.json('/signin route db select error'));
});
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    const hashedPass = bcrypt_1.default.hashSync(password, 10);
    db.transaction(trx => {
        trx('login').insert({
            has: hashedPass,
            email: email
        })
            .returning('email')
            .then(loginEmail => {
            trx('users').returning('*').insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0]);
            }).catch(err => res.json('Unable to register'));
        })
            .then(trx.commit)
            .catch(err => trx.rollback);
    });
});
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where('id', id).then(user => {
        if (user.length) {
            res.json(user[0]);
        }
        else {
            res.status(400).json("not found user");
        }
    }).catch(err => {
        res.status(400).json("Error getting user");
    });
});
app.put("/image", async (req, res) => {
    const { id, imageURL } = req.body;
    const fr_response = await (0, faceRecognition_1.faceRecognition)(imageURL);
    if (typeof fr_response === "boolean") {
        res.json("There is no faces on image");
    }
    else {
        db('users').where('id', '=', id).increment('entries', 1).returning('entries').then(entries => {
            res.json({ entries: entries[0].entries, fr_response });
        });
    }
});
app.listen(3001, () => console.log(`running on 3001`));
/*
/profile/:userId ==> GET = user
/image --> PUT == user
*/ 
