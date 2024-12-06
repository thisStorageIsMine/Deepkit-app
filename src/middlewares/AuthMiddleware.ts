import { HttpMiddleware, HttpRequest, HttpResponse, HttpUnauthorizedError } from '@deepkit/http';
import { jwtVerify } from 'jose';
import { accessSecretJwt } from '../config';

export class AuthMiddleware implements HttpMiddleware {
    async execute(req: HttpRequest, res: HttpResponse, next: (err?: any) => void) {
        const jwt = getDataFromCookies(req.headers.cookie, 'Authorization');
        await jwtVerify(jwt, accessSecretJwt);

        next();
    }
}

export const getDataFromCookies = (cookies: string | undefined, cookieName: string) => {
    if (!cookies) {
        throw new HttpUnauthorizedError();
    }

    const splittedCookies = cookies.split('; ').map((cookie) => cookie.split('='));
    const neededCookie = splittedCookies.find((cookie) => cookie[0] === cookieName);

    if (!neededCookie) {
        throw new HttpUnauthorizedError();
    }

    return neededCookie[1];
};
