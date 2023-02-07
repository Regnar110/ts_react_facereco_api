import { RequestOptions, FaceRecoBody } from "../Interfaces/request_inerfaces";
import { getBoundingBoxes } from "./getBoundingBoxes";
export const faceRecognition = async (IMAGE_URL:URL) => {
    console.log("faceRecognition:")
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "45fb9a671625463fa646c3523a3087d5";

    const faceRecoBody:FaceRecoBody = {
        user_app_id: {
            user_id: process.env.FR_USER_ID!,
            app_id: process.env.FR_APP_ID!
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
    }
    const requestOptions:RequestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': process.env.FR_API_KEY!
        },
        body: JSON.stringify(faceRecoBody)
    };
    const response:Response =  await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/"+ MODEL_VERSION_ID + "/outputs", requestOptions)
    const parseResponse = await response.json();
    return getBoundingBoxes(parseResponse)
}