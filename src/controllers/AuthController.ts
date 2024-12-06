import { HttpBody, HttpError, HttpQuery, HttpRequest, HttpResponse, http } from '@deepkit/http';
import { SQLiteDatabase } from '../modules';
import { IUser, User } from '../models';
import { AuthService, UserService } from '../providers';
import { getDataFromCookies } from '../middlewares';

export class AuthController {
    constructor(
        private database: SQLiteDatabase,
        private userService: UserService,
        private authService: AuthService,
    ) {}

    @(http.POST('/signup').name('signup'))
    async signUp(body: HttpBody<IUser>) {
        const newUser = await this.userService.signUp(body);
        return newUser;
    }

    @http.GET('/is-login-exists')
    async checkIsLoginExists(login: HttpQuery<string>) {
        try {
            const ok = this.userService.isLoginExists(login);
        } catch (error) {
            throw new HttpError(`Login: "${login}" does not exists`, 204);
        }
    }

    @(http.POST('/login').name('login'))
    async login(candidat: HttpBody<User>) {
        return await this.userService.login(candidat.login, candidat.password);
    }

    @(http.POST('/jwt/refresh').name('jwt/refresh'))
    async refreshJwt(candidate: HttpBody<User>, req: HttpRequest) {
        const refreshToken = getDataFromCookies(req.headers.cookie, 'refreshToken');

        const newTokens = await this.authService.refreshJwt(candidate, refreshToken);
    }

    @http.GET('/ping')
    async pind() {
        return 'pong';
    }
}
