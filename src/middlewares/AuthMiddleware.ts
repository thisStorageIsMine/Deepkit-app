import { HttpMiddleware, HttpRequest, HttpResponse, HttpUnauthorizedError } from '@deepkit/http';
import { jwtVerify } from 'jose';
import { accessSecretJwt } from '../config';

// export class AuthMiddleware implements HttpMiddleware {
//     async execute(req: HttpRequest, res: HttpResponse, next: (err?: any) => void) {
//         const jwt = getDataFromCookies(req.headers.cookie, 'Authorization');
//         await jwtVerify(jwt, accessSecretJwt);

//         res.head;
//         next();
//     }
// }

// export const getTokensFromRequest = (req: HttpRequest) => {
//     const x: Buffer = req.body?.map(n);
// };
