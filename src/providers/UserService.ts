import { Database } from "@deepkit/orm";
import * as bcrypt from "bcrypt"
import { IUser, User } from "../models";
import { cast } from "@deepkit/type";
import { HttpError, HttpNotFoundError } from "@deepkit/http";

export class UserService {
    async hashPassword(password: string) {

        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(password, saltRounds)

        return hashedPass
    }

    async addUser(db: Database, data: IUser) {
        const user = cast<User>(data);
        user.password = await this.hashPassword(user.password)

        await db.persist(user)
    }

    async checkUser(db: Database, data: IUser) {
        const user = await db.query(User).filter({ login: data.login }).findOneOrUndefined();

        if (user === undefined) {
            throw new HttpError("There is no such user", 400)
        }

        const hashedPassword = user.password
        if (hashedPassword === "") {
            return true;
        }

        const isPasswordsEqual = await bcrypt.compare(data.password, hashedPassword)
        return isPasswordsEqual
    }
}