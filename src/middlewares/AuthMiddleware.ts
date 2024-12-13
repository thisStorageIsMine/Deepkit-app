import { HttpMiddleware, HttpRequest, HttpResponse, HttpUnauthorizedError } from '@deepkit/http';
import { jwtVerify } from 'jose';
import { accessSecretJwt } from '../config';

export class AuthMiddleware implements HttpMiddleware {
    async execute(req: HttpRequest, res: HttpResponse, next: (err?: any) => void) {
        const bodyBuffer = await req.readBody();
        let body: any;

        try {
            body = JSON.parse(bodyBuffer.toString());
        } catch (error) {
            console.error('Error parsing JSON body:', error);
            next(error); // Передача ошибки дальше по цепочке
            return;
        }

        next();
    }
}
