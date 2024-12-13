import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { HttpError, JSONResponse, http, httpMiddleware, httpWorkflow } from '@deepkit/http';
import { SQLiteDatabase, ServerModule } from './modules';
import { Response } from '@deepkit/http';
import { AuthService, UserService } from './providers';
import { AuthController } from './controllers';
import { NoteService } from './providers/NoteService';
// import { AuthMiddleware } from './middlewares';
import { CorsMiddleware } from './middlewares/CorsMiddleware';
import { AuthMiddleware } from './middlewares';
import { GuardService } from './providers/GuardService';

const app = new App({
    imports: [
        new FrameworkModule({
            debug: true,
            migrateOnStartup: true,
        }),
        new ServerModule(),
    ],
    middlewares: [httpMiddleware.for(CorsMiddleware)],
    providers: [
        SQLiteDatabase,
        UserService,
        AuthService,
        NoteService,
        CorsMiddleware,
        GuardService,
    ],
});

app.listen(httpWorkflow.onControllerError, (e) => {
    if (e.error instanceof HttpError) {
        e.send(new Response(e.error.message, 'text/plain').status(e.error.httpCode));
    }

    e.send(new Response('Internal server error', 'text/plain').status(500));
});

app.listen(httpWorkflow.onResponse, (e) => {
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH',
    });

    e.response.setHeaders(headers);
});

app.run();
