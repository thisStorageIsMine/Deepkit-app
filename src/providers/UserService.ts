import { Database } from '@deepkit/orm';
import * as bcrypt from 'bcrypt';
import { IUser, User } from '../models';
import { cast } from '@deepkit/type';
import { HttpError, HttpInternalServerError, HttpNotFoundError, JSONResponse } from '@deepkit/http';
import { AuthService } from './AuthService';

export class UserService {
    constructor(private authService: AuthService) {}

    async isLoginExists(db: Database, login: string) {
        const user = await db.query(User).filter({ login }).findOneOrUndefined();

        return user !== undefined;
    }

    async login(db: Database, data: IUser) {
        const user = cast<User>(data);

        const login = user.login;
        const isLoginExists = await this.isLoginExists(db, login);

        if (isLoginExists) {
            throw new HttpError(`User with this login already exists`, 418);
        }

        user.password = await this.authService.hashPassword(user.password);

        await db.persist(user);
        let newUser: User;

        try {
            newUser = await db.query(User).filter({ login, password: user.password }).findOne();
        } catch (error) {
            throw new HttpInternalServerError();
        }

        const { accessJwt, refreshJwt } = await this.authService.generateTokens(newUser.getUser());
        return new JSONResponse({ ...user.getUser(), token: { accessJwt, refreshJwt } });
        1;
    }

    async signup(db: Database, data: User) {
        const hashedPassword = data.password;

        const isPasswordsEqual = await bcrypt.compare(data.password, hashedPassword);

        if (!isPasswordsEqual) {
            throw new HttpError('Wrong login or password', 401);
        }

        const userData = data.getUser();
        const jwt = this.authService.generateTokens(userData);
        return jwt;
    }
}

export type x = Pick<User, 'id'>;
