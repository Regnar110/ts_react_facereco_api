export interface SignInReq {
    email:string,
    password:string,
}

export interface RegisterReq {
    name: string,
    email: string,
    password: string,
}

//FACE RECO REQ BODY/OPTIONS


export interface FaceRecoBody {
    user_app_id: {
        user_id: string,
        app_id: string,
    },
    inputs: [
        {
            data: {
                image: {
                    url: URL
                }
            }
        }
    ]
}

export interface RequestOptions {
    method: string,
    headers: {
        Accept: string,
        Authorization: string
    },
    body: string
};