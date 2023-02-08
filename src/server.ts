import express, {json, Request, Response, Express, NextFunction } from "express"
import { RegisterReq, SignInReq } from "./Interfaces/request_inerfaces";
import bcrypt from "bcrypt"
import cors from "cors"
import * as dotenv from 'dotenv'
dotenv.config()
import { faceRecognition } from "./utils/faceRecognition";

const app:Express = express();
interface USER_DATA {
    id:string,
    name:string,
    email:string,
    password?:string,
    entries:number,
    joined: Date
}

let database = {
    users: [
        {
            id: "123",
            name: "John",
            email: "john@gmail.com",
            password: bcrypt.hashSync("cookies", 10),
            entries: 0,
            joined: new Date()
        },
        {
            id: "124",
            name: "Mati",
            email: "Mati@gmail.com",
            password: bcrypt.hashSync("ciastko", 10),
            entries: 1,
            joined: new Date()
        },
        {
            id: "125",
            name: "Jan",
            email: "jan@gmail.com",
            password: bcrypt.hashSync("arbuz", 10),
            entries: 3,
            joined: new Date()
        },
        {
            id: "126",
            name: "Kamil",
            email: "kamil@gmail.com",
            password: bcrypt.hashSync("raples", 10),
            entries: 10,
            joined: new Date()
        }
    ]
}

app.use(json());
app.use(cors())

app.get("/", (req, res) => {
    res.json(database.users)
})


app.post("/signin", (req,res) => {
    const body:SignInReq = req.body
    console.log(database)
    const matchedUser:USER_DATA[] = database.users.filter(user =>{
        const passwordMatched = bcrypt.compareSync(body.password, user.password);
        return body.email === user.email && passwordMatched     
    })
    if(matchedUser.length > 0) {
        const userClone = structuredClone(matchedUser[0]);
        //używamy structuredClone by nie ingierować metodą delete w oryginalny obiekt w pamięci.
        delete userClone.password
        console.log(matchedUser)
        res.status(200).json(userClone)
    } else {
        res.status(400).json("user not found")
    }
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
    const userClone:USER_DATA = structuredClone(database.users[database.users.length-1])
    delete userClone.password
    res.json(userClone)
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

app.put("/image", async (req, res) => {
    const {id, imageURL} = req.body;
    const fr_response =  await faceRecognition(imageURL)
    if(typeof fr_response === "boolean") {
        res.json("There is no faces on image")
    } else {
        for(let el of database.users) {
            if(el.id === id) {
                el.entries++
                let entries = el.entries
                res.json({entries, fr_response})
            }
        }
    }
    
    
})

app.listen(3001, () => console.log(`running on 3001`))

/*
/profile/:userId ==> GET = user
/image --> PUT == user
*/