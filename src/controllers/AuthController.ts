import {
    HttpBody,
    HttpController,
    HttpError,
    HttpQuery,
    HttpRequest,
    HttpResponse,
    JSONResponse,
    Response,
    http,
} from '@deepkit/http';
import { SQLiteDatabase } from '../modules';
import { IUser, User } from '../models';
import { AuthService, UserService } from '../providers';
// import { getDataFromCookies } from '../middlewares';
import { setCors } from '../utils';

export class AuthController {
    constructor(
        private database: SQLiteDatabase,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    @http.OPTIONS('/auth/signup')
    dummy() {
        return 'ok';
    }

    @http.OPTIONS('/auth/login')
    dummy2() {
        return 'ok';
    }

    @http.OPTIONS('/auth/refresh')
    dummy3() {
        return new Response('ok', 'text/plain');
    }

    @(http.POST('/auth/signup').name('signup'))
    async signUp(body: HttpBody<IUser>, res: HttpResponse) {
        const newUser = await this.userService.signUp(body);

        return newUser;
    }

    @http.GET('/auth/is-login-exists')
    async checkIsLoginExists(login: HttpQuery<string>) {
        return { is_exists: await this.userService.isLoginExists(login) };
    }

    @(http.POST('/auth/login').name('login'))
    async login(candidat: HttpBody<User>) {
        return await this.userService.login(candidat.login, candidat.password);
    }

    @(http.POST('/auth/refresh').name('jwt/refresh'))
    async refreshJwt(candidate: HttpBody<User>, req: HttpRequest) {
        // const refreshToken = getDataFromCookies(req.headers.cookie, 'refreshToken');

        return await this.authService.refreshJwt(candidate, 'refreshToken');
    }

    @http.GET('/ping')
    async pind() {
        return 'pong';
    }
}
