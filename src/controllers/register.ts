import { Knex } from "knex"
import { ReturnedUser, ReturnedLOGIN_TRX } from "../Interfaces/psql_interfaces"
import { RegisterReq } from "../Interfaces/request_inerfaces"
import bcrypt from "bcrypt";

export const register = async (req:any, res:any, db:Knex) => {
    const {name, email, password}:RegisterReq = req.body
    const hashedPass = bcrypt.hashSync(password, 10)
    try {
        await db.transaction(async (trx) => {
            const loginEmail:ReturnedLOGIN_TRX[] = await trx<ReturnedLOGIN_TRX>('login')
                .insert({
                    has:hashedPass,
                    email:email
                })
                .returning('email');
            const user:ReturnedUser = await trx('users').returning('*').insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            res.json(user[0])
            console.log(user)
        })
    } catch(err) {
        res.status(400).json("/register route path overall error!")
    }
}