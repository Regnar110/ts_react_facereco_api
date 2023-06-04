"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceRecognition = void 0;
const getBoundingBoxes_1 = require("./getBoundingBoxes");
const faceRecognition = async (IMAGE_URL) => {
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
    const faceRecoBody = {
        user_app_id: {
            user_id: process.env.FR_USER_ID,
            app_id: process.env.FR_APP_ID
        },
        inputs: [
            {
                data: {
                    image: {
                        url: IMAGE_URL
                    }
                }
            }
        ]
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.FR_API_KEY
        },
        body: JSON.stringify(faceRecoBody)
    };
    const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
    const parseResponse = await response.json();
    return (0, getBoundingBoxes_1.getBoundingBoxes)(parseResponse);
};
exports.faceRecognition = faceRecognition;
