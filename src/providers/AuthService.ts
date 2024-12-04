import { User } from '../models';
import * as bcrypt from 'bcrypt';
import { EncryptJWT, JWTPayload, SignJWT } from 'jose';
import { accessSecretJwt, refreshSecretJwt } from '../config';

export class AuthService {
    private async generateJWT(
        payload: Record<string, unknown>,
        secret: Uint8Array,
        expireIn: string,
    ) {
        const alg = 'HS256';

        const jwt = await new SignJWT(payload)
            .setIssuedAt()
            .setExpirationTime(expireIn)
            .setProtectedHeader({ alg })
            .sign(secret);

        return jwt;
    }

    async hashPassword(password: string) {
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(password, saltRounds);

        return hashedPass;
    }

    public async generateTokens(payload: Record<string, unknown>) {
        const accessJwt = await this.generateJWT(payload, accessSecretJwt, '15m');
        const refreshJwt = await this.generateJWT(payload, refreshSecretJwt, '7d');

        return {
            accessJwt,
            refreshJwt,
        };
    }
}
