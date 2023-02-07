"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceRecognition = void 0;
const getBoundingBoxes_1 = require("./getBoundingBoxes");
const faceRecognition = async (IMAGE_URL) => {
    console.log("faceRecognition:");
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "45fb9a671625463fa646c3523a3087d5";
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
