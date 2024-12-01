import { User } from "../models";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export class AuthService {
    public generateJWT(user: User) {
        const data = user.getUser();

        const signature = "PfBvgthfnjhf!";
        const ttl = "12h";

        return jwt.sign(data, signature, {
            expiresIn: ttl,
        });
    }

    async hashPassword(password: string) {
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(password, saltRounds);

        return hashedPass;
    }
}
