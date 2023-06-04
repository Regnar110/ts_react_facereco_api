"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.image = void 0;
const faceRecognition_1 = require("../utils/faceRecognition");
const image = async (req, res, db) => {
    const { id, imageURL } = req.body;
    console.log(id, imageURL);
    try {
        const fr_response = await (0, faceRecognition_1.faceRecognition)(imageURL);
        console.log(fr_response);
        if (typeof fr_response === "boolean") {
            res.json("There is no faces on image");
        }
        else {
            try {
                console.log("helllo");
                const entries = await db('users')
                    .where('id', id).increment('entries', 1).returning('entries');
                res.json({ entries: entries[0].entries, fr_response });
            }
            catch (err) {
                res.status(400).json('/image route updating entries and fr_response error!');
            }
        }
    }
    catch (err) {
        res.status(400).json("/image route overall error!");
    }
};
exports.image = image;
