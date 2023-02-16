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
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("knex");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//Knex Config file
const knex_config_1 = require("./utils/knex_config");
//Controlers 
const signin_1 = require("./controllers/signin");
const register_1 = require("./controllers/register");
const image_1 = require("./controllers/image");
const db = (0, knex_1.knex)(knex_config_1.knex_config); // knex INIT
const app = (0, express_1.default)(); // express INIT
app.use((0, express_1.json)()); // ENABLE BODY PARSING FROM express.js
app.use((0, cors_1.default)()); // CORS for enabling !"unsafe"! connections
app.set('trust proxy', true);
app.get('/', (req, res) => {
    res.json("JEstem");
});
app.post("/signin", (req, res) => (0, signin_1.singIn)(req, res, db));
app.post("/register", (req, res) => (0, register_1.register)(req, res, db));
app.put("/image", (req, res) => (0, image_1.image)(req, res, db));
//PROFILE/:ID FOR FURTHER IMPLEMENATIONS - NOT USED RIGHT NOOW
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
app.listen(process.env.PORT || 3001, () => console.log('Running'));
