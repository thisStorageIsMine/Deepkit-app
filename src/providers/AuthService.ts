import { User } from "../models";
import * as bcrypt from "bcrypt";
import { signatureJwt } from "../config";
import { EncryptJWT, JWTPayload } from "jose";


export class AuthService {
    public async generateJWT(payload: Record<string, unknown>) {

        const jwt = await new EncryptJWT(payload)
                                        .setProtectedHeader({
                                            alg: "dir", enc: "A128CBC-HS256"
                                        })
                                        .setIssuedAt(new Date())
                                        .setExpirationTime("15m")
                                        .setIssuer("localhost")
                                        .setAudience('audience')
                                        .encrypt(signatureJwt)


        return jwt
    }

    async hashPassword(password: string) {
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(password, saltRounds);

        return hashedPass;
    }
}
