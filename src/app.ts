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

const app = new App({
    imports: [
        new FrameworkModule({
            debug: true,
            migrateOnStartup: true,
        }),
        new ServerModule(),
    ],
    middlewares: [
        // httpMiddleware.for(AuthMiddleware).forRoutes({
        //     group: 'notes',
        // }),
        httpMiddleware.for(CorsMiddleware),
    ],
    providers: [
        SQLiteDatabase,
        UserService,
        AuthService,
        NoteService,
        // AuthMiddleware,
        CorsMiddleware,
    ],
});

app.listen(httpWorkflow.onControllerError, (e) => {
    if (e.error instanceof HttpError) {
        e.send(new Response(e.error.message, 'text/plain').status(e.error.httpCode));
    }

    e.send(new Response('Internal server error', 'text/plain').status(500));
});

// app.listen(httpWorkflow.onRouteNotFound, (e) => {
//     const method = e.request.method;

//     if (method === 'OPTIONS') {
//         e.send(
//             new Response('Ok', 'text/plain')
//                 .status(200)
//                 .header('Access-Control-Allow-Origin', 'http://localhost:5173')
//                 .header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS, PUT')
//                 .header('Access-Control-Allow-Headers', 'Content-Type'),
//         );
//     }
// });

app.listen(httpWorkflow.onResponse, (e) => {
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH',
    });

    e.response.setHeaders(headers);
});

app.run();
