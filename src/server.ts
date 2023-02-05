import express, {json, Request, Response, Express, NextFunction } from "express"
import { RegisterReq, SignInReq } from "./Interfaces/request_inerfaces";
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
    res.send("this working")
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
    database.users.push({
        id:"127",
        name: body.name,
        email: body.email,
        password: body.password,
        entries: 0,
        joined: new Date()
    })
})

app.listen(3001, () => console.log(`running on 3001`))

/*
/signin -- POST == succes/fail
/register -- POST = user
/profile/:userId ==> GET = user
/image --> PUT == user
*/