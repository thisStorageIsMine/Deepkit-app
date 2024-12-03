import { Database } from "@deepkit/orm";
import * as bcrypt from "bcrypt";
import { IUser, User } from "../models";
import { cast } from "@deepkit/type";
import { HttpError, HttpNotFoundError } from "@deepkit/http";
import { AuthService } from "./AuthService";

export class UserService {
    constructor(private authSrvice: AuthService) {}

    async isLoginExists(db: Database, login: string) {
        const isLoginExists =
            (await db.query(User).filter({ login }).findOneOrUndefined) !== undefined;

        if (isLoginExists) {
            throw new HttpError(`User with login "${login}" already exists`, 204);
        }
    }

    async addUser(db: Database, data: IUser) {
        const user = cast<User>(data);

        const login = user.login;

        await this.isLoginExists(db, login);

        user.password = await this.authSrvice.hashPassword(user.password);

        await db.persist(user);
    }

    async checkUser(db: Database, data: IUser) {
        const user = await db.query(User).filter({ login: data.login }).findOneOrUndefined();

        if (user === undefined) {
            throw new HttpError("Wrong login or password", 401);
        }

        const hashedPassword = user.password;
        if (hashedPassword === "") {
            return user.getUser();
        }

        const isPasswordsEqual = await bcrypt.compare(data.password, hashedPassword);

        if (!isPasswordsEqual) {
            throw new HttpError("Wrong login or password", 401);
        }

        const userData = user.getUser()
        const jwt = this.authSrvice.generateJWT(userData)
        return jwt;
    }
}
