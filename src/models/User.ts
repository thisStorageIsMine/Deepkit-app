import { AutoIncrement, PrimaryKey, Unique, entity } from '@deepkit/type';

type TLogin = string & Unique;

@entity.name('user')
export class User {
    id: number & PrimaryKey & AutoIncrement = 0;
    role: 'user' | 'admin' = 'user';

    constructor(
        public login: TLogin,
        public password: string,
    ) {}

    getUser() {
        return {
            login: this.login,
            role: this.role,
            id: this.id,
        };
    }
}

export interface IUser {
    login: string;
    password: string;
}
