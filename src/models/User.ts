import { AutoIncrement, PrimaryKey, Unique, entity } from "@deepkit/type";

type TLogin = string & Unique

@entity.name('user')
export class User {
    id: number & PrimaryKey & AutoIncrement = 0;

    constructor(public login: TLogin, public password: string) { }
}

export interface IUser {
    login: string;
    password: string;
}