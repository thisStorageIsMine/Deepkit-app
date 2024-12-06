import { HttpMiddleware, HttpRequest, HttpResponse, HttpUnauthorizedError } from '@deepkit/http';
import { jwtVerify } from 'jose';
import { accessSecretJwt } from '../config';

export class AuthMiddleware implements HttpMiddleware {
    async execute(req: HttpRequest, res: HttpResponse, next: (err?: any) => void) {
        try {
            const jwt = getJwtFromCookie(req.headers.cookie);
            await jwtVerify(jwt, accessSecretJwt);

            next();
        } catch {
            throw new HttpUnauthorizedError();
        }
    }
}

const getJwtFromCookie = (cookies: string | undefined) => {
    if (!cookies) {
        throw new Error('Unauthorized');
    }

    const splittedCookies = cookies.split('; ').map((cookie) => cookie.split('='));
    const auth = splittedCookies.find((cookie) => cookie[0] === 'Authorization');

    if (!auth) {
        throw new Error('Unauthorized');
    }

    return auth[1];
};
