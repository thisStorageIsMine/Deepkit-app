import { HttpBody, HttpUnauthorizedError } from '@deepkit/http';
import { AuthBody } from '../bodies';
import { jwtVerify } from 'jose';
import { accessSecretJwt } from '../config';

export const checkAuth = async (body: HttpBody<AuthBody & unknown>) => {
    const access = body.tokens.access;

    try {
        await jwtVerify(access, accessSecretJwt);
    } catch {
        throw new HttpUnauthorizedError();
    }
};
