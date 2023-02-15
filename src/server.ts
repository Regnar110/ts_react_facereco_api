import express, {json, Express} from "express"
import cors from "cors"
import { knex } from 'knex'
import * as dotenv from 'dotenv'
dotenv.config()
//Knex Config file
import { knex_config } from "./utils/knex_config"
//Controlers 
import { singIn } from "./controllers/signin"
import { register } from "./controllers/register"
import { image } from "./controllers/image"

const db = knex(knex_config) // knex INIT
const app:Express = express(); // express INIT

app.use(json()); // ENABLE BODY PARSING FROM express.js
app.use(cors()) // CORS for enabling !"unsafe"! connections

app.get('/', (req, res) => {
    res.send("<h1>HELLOOOO HERE</h1>")
})

app.post("/signin", (req, res) => singIn(req, res, db))

app.post("/register", (req,res) => register(req, res, db))

app.put("/image", (req, res) => image(req, res, db))

//PROFILE/:ID FOR FURTHER IMPLEMENATIONS - NOT USED RIGHT NOW
app.get('/profile/:id', (req, res) => {
    const {id} = req.params
    db.select('*').from('users').where('id', id).then(user => {
        if(user.length) {
            res.json(user[0])
        } else {
            res.status(400).json("not found user")
        }
        
    }).catch(err => {
        res.status(400).json("Error getting user")
    })

})


app.listen(process.env.PORT || 3001, () => console.log('Running'))