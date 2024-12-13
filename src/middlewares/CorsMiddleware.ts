import { HttpMiddleware, HttpRequest, HttpResponse, Response } from '@deepkit/http';

export class CorsMiddleware implements HttpMiddleware {
    async execute(req: HttpRequest, res: HttpResponse, next: (err?: any) => void) {
        const method = req.method;

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('charset', 'utf-8');
        if (method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
        }

        next();
    }
}
