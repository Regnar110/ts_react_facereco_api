//LOGIN table ROW TYPE

export interface LoginRow {
    email:string
    has:string
}

export type ReturnedUser = [{
    email: string,
    entries: number,
    id: number,
    joined: Date,
    name: string
}]

export type ReturnedEntries = [{
    entries:number
}]