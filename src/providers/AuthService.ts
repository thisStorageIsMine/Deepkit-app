import { User } from '../models';
import * as bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { accessExp, accessSecretJwt, refreshExp, refreshSecretJwt } from '../config';
import { SQLiteDatabase } from '../modules';
import { HttpUnauthorizedError } from '@deepkit/http';

export class AuthService {
    constructor(private db: SQLiteDatabase) {}

    private async generateJWT(
        payload: Record<string, unknown>,
        secret: Uint8Array,
        expireIn: string | number,
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
        const accessJwt = await this.generateJWT(payload, accessSecretJwt, accessExp);
        const refreshJwt = await this.generateJWT(payload, refreshSecretJwt, refreshExp);

        return {
            accessJwt,
            refreshJwt,
        };
    }

    public async refreshJwt(candidate: User, refreshToken: string) {
        const user = await this.db.query(User).filter({ id: candidate.id }).findOneOrUndefined();

        if (!user) {
            throw new HttpUnauthorizedError('No such user');
        }

        const refreshFromDb = this.findRefreshToken(user);

        if (!refreshFromDb) {
            throw new HttpUnauthorizedError("Can't refresh token. Unauthorized user");
        }

        await this.verifyToken(refreshToken, 'refresh');

        const newTokens = await this.generateTokens(user.getUser());
        await this.db
            .query(User)
            .filter({ id: user.id })
            .patchOne({ refresh_token: newTokens.refreshJwt });

        return newTokens;
    }

    public async verifyToken(token: string, type: 'refresh' | 'access') {
        const secrets = {
            refresh: refreshSecretJwt,
            access: accessSecretJwt,
        };

        return await jwtVerify(token, secrets[type]).catch(() => {
            throw new HttpUnauthorizedError('wrong jwt');
        });
    }

    public async findRefreshToken(user: User) {
        return await this.db.query(User).filter({ id: user.id }).findOneOrUndefined();
    }
}
