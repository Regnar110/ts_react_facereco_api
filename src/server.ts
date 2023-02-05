import express, {json, Request, Response, Express, NextFunction } from "express"
import { RegisterReq, SignInReq } from "./Interfaces/request_inerfaces";
import bcrypt from "bcrypt"

const app:Express = express()

const database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: "cookies",
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Mati",
            email: "Mati@gmail.com",
            password: "ciastko",
            entries: 1,
            joined: new Date()
        },
        {
            id: "125",
            name: "Jan",
            email: "jan@gmail.com",
            password: "arbuz",
            entries: 3,
            joined: new Date()
        },
        {
            id: "126",
            name: "Kamil",
            email: "kamil@gmail.com",
            password: "raples",
            entries: 10,
            joined: new Date()
        }
    ]
}

app.use(json());

app.get("/", (req, res) => {
    res.json(database.users)
})


app.post("/signin", (req,res) => {
    const body:SignInReq = req.body
    if(body.email === database.users[0].email &&
    body.password === database.users[0].password) {
            res.json("succes")
    } else {
        res.status(400).json("error logging in")
    }
    console.log(body) 
    // res.json() działa jak .send() tylko że od razu wysyła w formacie JSON
})

app.post("/register", (req,res) => {
    const body:RegisterReq = req.body
    const hashedPass = bcrypt.hashSync(body.password, 10)
    database.users.push({
        id:"127",
        name: body.name,
        email: body.email,
        password: hashedPass,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const {body} = req;
    const {id} = req.params
    let found = false
    database.users.forEach(user => {
        if(user.id === id) {
            found = true
            return res.json(user)
        }
    })
    if(!found){
        res.status(400).json("Not Found")
    }
})

app.put("/image", (req, res) => {
    const {id} = req.body;
    let found = false
    database.users.forEach(user => {
        if(user.id === id) {
            found = true
            user.entries++
            return res.json(user.entries)
        }
    })
    if(!found){
        res.status(400).json("Not Found")
    }
    
})

app.listen(3001, () => console.log(`running on 3001`))

/*
/profile/:userId ==> GET = user
/image --> PUT == user
*/