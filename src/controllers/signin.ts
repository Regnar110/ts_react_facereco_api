import { SignInReq } from "../Interfaces/request_inerfaces";
import { ReturnedLoginRow, LoginRow, ReturnedUser } from "../Interfaces/psql_interfaces";
import { Knex } from "knex";
import bcrypt from "bcrypt"


export const singIn = async (req:any, res:any, db:Knex) => {
        try {
            const {password, email}:SignInReq = req.body
            const loginRowData:ReturnedLoginRow = await db<LoginRow>('login').select('email', 'has').where({email: email})
            const passwordMatched:boolean = bcrypt.compareSync(password, loginRowData[0].has);
        try {
            if(passwordMatched) {
                const user:ReturnedUser = await db('users').select('*')
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
}