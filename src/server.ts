import express, {json, Request, Response, Express, NextFunction } from "express"
import { RegisterReq, SignInReq } from "./Interfaces/request_inerfaces";
import bcrypt from "bcrypt"
import cors from "cors"
import { Knex, knex } from 'knex'
import * as dotenv from 'dotenv'
dotenv.config()
import { faceRecognition } from "./utils/faceRecognition";

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


app.post("/signin", (req,res) => {
    const {password, email}:SignInReq = req.body
    db.select('email', 'has').from('login')
    .where({email: email})
    .then(data => {
        const passwordMatched = bcrypt.compareSync(password, data[0].has);
        if(passwordMatched) {
            return db.select('*').from('users')
            .where('email', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.json('sign in passwordMatch db select error'))
        } else {
           res.json("wron email or password") 
        }
    }).catch(err => res.json('/signin route db select error'))
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
    const fr_response =  await faceRecognition(imageURL)
    if(typeof fr_response === "boolean") {
        res.json("There is no faces on image")
    } else {
        db('users').where('id', '=', id).increment('entries', 1).returning('entries').then(entries => {
            res.json({entries:entries[0].entries, fr_response})
        })
    }
    
    
})

app.listen(3001, () => console.log(`running on 3001`))

/*
/profile/:userId ==> GET = user
/image --> PUT == user
*/