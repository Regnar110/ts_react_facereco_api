//LOGIN table ROW TYPE
export interface LoginRow {
    email:string
}

export interface ReturnedLoginRow {
    [index: number]: {email:string, has:string}
}

export interface ReturnedUser {
    [index:number]:{
        email: string,
        entries: number,
        id: number,
        joined: Date,
        name: string
    }
}

export interface ReturnedEntries {
    [index: number]: { entries:number }
}

//REGISTER EOUTE TRANASACTION TYPES 

export interface ReturnedLOGIN_TRX {
        email: string
        has:string
}