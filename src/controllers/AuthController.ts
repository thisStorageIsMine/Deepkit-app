import { HttpBody, http } from "@deepkit/http";
import { SQLiteDatabase } from "../modules";
import { IUser } from "../models";
import { UserService } from "../providers";
import { Injector } from '@deepkit/injector'



export class AuthController {
    constructor(private database: SQLiteDatabase, private userService: UserService) { }

    @http.POST("/signup")
    async signUp(body: HttpBody<IUser>) {
        console.log("Кто-то стучиться в signUp")
        console.log(body)
        await this.userService.addUser(this.database, body)

        return 'Пользователь добавлен'
    }

    @http.POST('/login')
    async logIn(body: HttpBody<IUser>) {
        const ok = await this.userService.checkUser(this.database, body);

        return ok ? "Вы вошли!" : "Нет! Что-то не так"
    }

    @http.GET('/ping')
    async pind() {
        return 'pong'
    }

}