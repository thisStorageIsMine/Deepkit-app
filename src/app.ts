import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { HttpError, http, httpMiddleware, httpWorkflow } from '@deepkit/http';
import { SQLiteDatabase, ServerModule } from './modules';
import { Response } from '@deepkit/http';
import { AuthService, UserService } from './providers';
import { AuthController } from './controllers';
import { NoteService } from './providers/NoteService';
import { AuthMiddleware } from './middlewares';

const app = new App({
    imports: [
        new FrameworkModule({
            debug: true,
            migrateOnStartup: true,
        }),
        new ServerModule(),
    ],
    middlewares: [httpMiddleware.for(AuthMiddleware).forRouteNames('jwt/refresh')],
    providers: [SQLiteDatabase, UserService, AuthService, NoteService, AuthMiddleware],
});

app.listen(httpWorkflow.onControllerError, (e) => {
    if (e.error instanceof HttpError) {
        e.send(new Response(e.error.message, 'text/plain').status(e.error.httpCode));
    }

    e.send(new Response('Internal server error', 'text/plain').status(500));
});

app.run();
