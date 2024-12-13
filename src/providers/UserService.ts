import { Database } from '@deepkit/orm';
import * as bcrypt from 'bcrypt';
import { IUser, Note, User } from '../models';
import { cast } from '@deepkit/type';
import {
    HttpBadRequestError,
    HttpError,
    HttpInternalServerError,
    HttpNotFoundError,
    HttpUnauthorizedError,
    JSONResponse,
} from '@deepkit/http';
import { AuthService } from './AuthService';
import { refreshSecretJwt, welcomeNote } from '../config';
import { SQLiteDatabase } from '../modules';
import { Logger } from '@deepkit/logger';
import { supabase } from '../supabase/instanceSupabase';
import { jwtDecrypt, jwtVerify } from 'jose';

function decodeToken(token: string) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export class UserService {
    constructor(
        private authService: AuthService,
        private db: SQLiteDatabase,
    ) {}

    async isLoginExists(login: string) {
        const user = await this.db.query(User).filter({ login }).findOneOrUndefined();
        return user !== undefined;
    }

    async signUp(data: IUser) {
        const user = cast<User>(data);

        const login = user.login;
        const isLoginExists = await this.isLoginExists(login);

        if (isLoginExists) {
            throw new HttpError(`User with this login already exists`, 418);
        }

        user.password = await this.authService.hashPassword(user.password);

        const { error, data: newUser } = await supabase
            .from('users')
            .insert({ login: user.login, password: user.password })
            .select();
        if (error) {
            throw new HttpInternalServerError('Failed to create user. :(');
        }

        await this.db.persist(user);

        // Да я просто вставил сюда запрос на создание в другой таблице вместо триггера. Потому что не нашёл как запускать SQL при миграциях
        await this.db.persist(new Note(user, welcomeNote.name, welcomeNote.payload));

        const { accessJwt, refreshJwt } = await this.authService.generateTokens({
            ...user.getUser(),
            id: newUser[0].id,
        });

        await this.db
            .query(User)
            .filter({ id: user.id })
            .patchOne({ refresh_token: refreshJwt, key: newUser[0].id });

        return { ...user.getUser(), tokens: { accessJwt, refreshJwt }, id: newUser[0].id };
    }

    async login(login: string, password: string) {
        const user = await this.db.query(User).filter({ login }).findOneOrUndefined();

        if (login.trim().length === 0) {
            throw new HttpBadRequestError('Логин не может быть пустым');
        }

        if (password.trim().length === 0) {
            throw new HttpBadRequestError('Пароль не может быть пустым');
        }

        if (!user) {
            throw new HttpUnauthorizedError();
        }

        const hashedPass = this.authService.hashPassword(password);
        const isPasswordsEqual = await bcrypt.compare(password, user.password);

        if (!isPasswordsEqual) {
            throw new HttpUnauthorizedError('wrong password');
        }

        const { accessJwt, refreshJwt } = await this.authService.generateTokens(user.getUser());

        this.db.query(User).filter({ id: user.id }).patchOne({ refresh_token: refreshJwt });
        return { ...user.getUser(), tokens: { accessJwt, refreshJwt } };
    }

    async loginViaToken(token: string) {
        const x = await jwtVerify(token, refreshSecretJwt);

        const exp = x.payload.exp;

        if (!exp) throw new HttpUnauthorizedError();

        const payload = decodeToken(token);

        const user = await this.db.query(User).filter({ key: payload.id }).findOneOrUndefined();

        if (!user) throw new HttpUnauthorizedError();

        const storedToken = user.refresh_token;

        if (!storedToken) throw new HttpUnauthorizedError();

        const { accessJwt, refreshJwt } = await this.authService.generateTokens(user.getUser());

        return {
            tokens: {
                accessJwt,
                refreshJwt,
            },
        };
    }
}

export type x = Pick<User, 'id'>;
