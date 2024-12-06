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
import { welcomeNote } from '../config';
import { SQLiteDatabase } from '../modules';
import { Logger } from '@deepkit/logger';

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

        await this.db.persist(user);

        // Да я просто вставил сюда запрос на создание в другой таблице вместо триггера. Потому что не нашёл как запускать SQL при миграциях
        await this.db.persist(new Note(user, welcomeNote.name, welcomeNote.payload));

        const { accessJwt, refreshJwt } = await this.authService.generateTokens(user.getUser());

        this.db.query(User).filter({ id: user.id }).patchOne({ refresh_token: refreshJwt });

        return { ...user.getUser(), tokens: { accessJwt, refreshJwt } };
        1;
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

        const { accessJwt, refreshJwt } = await this.authService.generateTokens({
            id: user.id,
            login,
            password,
        });

        this.db.query(User).filter({ id: user.id }).patchOne({ refresh_token: refreshJwt });
        return { ...user.getUser(), tokens: { accessJwt, refreshJwt } };
    }
}

export type x = Pick<User, 'id'>;
