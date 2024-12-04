import { HttpBody, HttpError, HttpQuery, http } from '@deepkit/http';
import { SQLiteDatabase } from '../modules';
import { IUser, User } from '../models';
import { UserService } from '../providers';

export class AuthController {
    constructor(
        private database: SQLiteDatabase,
        private userService: UserService,
    ) {}

    // @http.POST('/signup')
    // async signUp(body: HttpBody<User>) {
    //     await this.userService.addUser(this.database, body);

    //     return 'Пользователь добавлен';
    // }

    @http.POST('/login')
    async logIn(body: HttpBody<IUser>) {
        console.log('Тук тук!');
        return await this.userService.login(this.database, body);
    }

    @http.GET('/is-login-exists')
    async checkIsLoginExists(login: HttpQuery<string>) {
        try {
            const ok = this.userService.isLoginExists(this.database, login);
        } catch (error) {
            throw new HttpError(`Login: "${login}" does not exists`, 204);
        }
    }

    @http.GET('/ping')
    async pind() {
        return 'pong';
    }
}
