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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const faceRecognition_1 = require("./utils/faceRecognition");
const app = (0, express_1.default)();
let database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: bcrypt_1.default.hashSync("cookies", 10),
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Mati",
            email: "Mati@gmail.com",
            password: bcrypt_1.default.hashSync("ciastko", 10),
            entries: 1,
            joined: new Date()
        },
        {
            id: "125",
            name: "Jan",
            email: "jan@gmail.com",
            password: bcrypt_1.default.hashSync("arbuz", 10),
            entries: 3,
            joined: new Date()
        },
        {
            id: "126",
            name: "Kamil",
            email: "kamil@gmail.com",
            password: bcrypt_1.default.hashSync("raples", 10),
            entries: 10,
            joined: new Date()
        }
    ]
};
app.use((0, express_1.json)());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.json(database.users);
});
app.post("/signin", (req, res) => {
    const body = req.body;
    console.log(database);
    const matchedUser = database.users.filter(user => {
        const passwordMatched = bcrypt_1.default.compareSync(body.password, user.password);
        return body.email === user.email && passwordMatched;
    });
    if (matchedUser.length > 0) {
        const userClone = structuredClone(matchedUser[0]);
        //używamy structuredClone by nie ingierować metodą delete w oryginalny obiekt w pamięci.
        delete userClone.password;
        console.log(matchedUser);
        res.status(200).json(userClone);
    }
    else {
        res.status(400).json("user not found");
    }
});
app.post("/register", (req, res) => {
    const body = req.body;
    const hashedPass = bcrypt_1.default.hashSync(body.password, 10);
    database.users.push({
        id: "127",
        name: body.name,
        email: body.email,
        password: hashedPass,
        entries: 0,
        joined: new Date()
    });
    const userClone = structuredClone(database.users[database.users.length - 1]);
    delete userClone.password;
    res.json(userClone);
});
app.get('/profile/:id', (req, res) => {
    const { body } = req;
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.status(400).json("Not Found");
    }
});
app.put("/image", async (req, res) => {
    const { id, imageURL } = req.body;
    const fr_response = await (0, faceRecognition_1.faceRecognition)(imageURL);
    if (typeof fr_response === "boolean") {
        res.json("There is no faces on image");
    }
    else {
        for (let el of database.users) {
            if (el.id === id) {
                el.entries++;
                let entries = el.entries;
                res.json({ entries, fr_response });
            }
        }
    }
});
app.listen(3001, () => console.log(`running on 3001`));
/*
/profile/:userId ==> GET = user
/image --> PUT == user
*/ 
