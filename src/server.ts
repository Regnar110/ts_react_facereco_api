import express, {json, Request, Response, Express, NextFunction } from "express"
import bcrypt from "bcrypt"
import cors from "cors"
import { Knex, knex } from 'knex'
import * as dotenv from 'dotenv'
dotenv.config()

//Utils
import { faceRecognition } from "./utils/faceRecognition";

//Interfaces
import { RegisterReq, SignInReq } from "./Interfaces/request_inerfaces";
import { LoginRow, ReturnedUser, ReturnedEntries } from "./Interfaces/psql_interfaces"
const config:Knex.Config = {
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '587188Ab',
      database : 'smartbrain'
    }
}

const db = knex(config) // knex INIT

const app:Express = express();
interface USER_DATA {
    id:string,
    name:string,
    email:string,
    password?:string,
    entries:number,
    joined: Date
}

app.use(json());
app.use(cors())

app.get("/", (req, res) => {
    res.json('get connection')
})


app.post("/signin", async (req,res) => {
    try {
        const {password, email}:SignInReq = req.body
        const loginRowData = await db<LoginRow>('login').select('email', 'has').where({email: email})
        const passwordMatched:boolean = bcrypt.compareSync(password, loginRowData[0].has);
        try {
            if(passwordMatched) {
                const user = await db<ReturnedUser>('users').select('*')
                    .where('email', email)
                res.json(user[0])
            } else {
                res.json("There is no such user")
            }             
        } catch(err) {
            res.status(400).json('400: /Signin internal user return error!')
        }
    } catch(err) {
        res.status(400).json('400: /Signin overall route error!')
    }
})



app.post("/register", (req,res) => {
    const {name, email, password}:RegisterReq = req.body
    const hashedPass = bcrypt.hashSync(password, 10)
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
                res.json(user[0])
            }).catch(err => res.json('Unable to register'))
        })
        .then(trx.commit)
        .catch(err => trx.rollback)
    })
})

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

app.put("/image", async (req, res) => {
    const {id, imageURL} = req.body;
    try {
        const fr_response =  await faceRecognition(imageURL)
        if(typeof fr_response === "boolean") {
            res.json("There is no faces on image")
        } else {
            try{
                const entries = await db<ReturnedEntries>('users')
                .where('id', id).increment('entries', 1).returning('entries')
                res.json({entries: entries[0].entries, fr_response})
            } catch(err) {
                res.status(400).json('/image route updating entries and fr_response error!')
            }
        }
    } catch(err) {
        res.status(400).json("/image route overall error!")
    }
})

app.listen(3001, () => console.log(`running on 3001`))