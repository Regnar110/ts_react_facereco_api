import { Knex } from "knex"
import { ReturnedEntries } from "../Interfaces/psql_interfaces"
import { BoundingBoxArrayOfObjects } from "../Interfaces/utils_interfaces";
import { faceRecognition } from "../utils/faceRecognition";

export const image = async (req:any, res:any, db:Knex) => {
    const {id, imageURL} = req.body;
    try {
        const fr_response:BoundingBoxArrayOfObjects[] | boolean =  await faceRecognition(imageURL)
        if(typeof fr_response === "boolean") {
            res.json("There is no faces on image")
        } else {
            try{
                console.log("helllo")
                const entries:ReturnedEntries = await db<ReturnedEntries>('users')
                .where('id', id).increment('entries', 1).returning('entries')
                res.json({entries: entries[0].entries, fr_response})
            } catch(err) {
                res.status(400).json('/image route updating entries and fr_response error!')
            }
        }
    } catch(err) {
        res.status(400).json("/image route overall error!")
    }
}