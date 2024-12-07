import { Database } from '@deepkit/orm';
import { AutoIncrement, PrimaryKey, Unique, entity } from '@deepkit/type';
import { Note } from './Note';
import { wrap } from '../utils';

type TLogin = string & Unique;

@entity.name('users')
export class User {
    id: number & PrimaryKey & AutoIncrement = 0;
    role: 'user' | 'admin' = 'user';
    created_at: Date = new Date();

    constructor(
        public login: TLogin,
        public password: string,
        public refresh_token?: string,
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
