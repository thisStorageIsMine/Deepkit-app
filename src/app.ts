import { App } from "@deepkit/app";
import { FrameworkModule } from "@deepkit/framework";
import { HttpError, http, httpWorkflow } from "@deepkit/http";
import { SQLiteDatabase, ServerModule } from "./modules";
import { Response } from "@deepkit/http";
import { UserService } from "./providers";
import { AuthController } from "./controllers";

const app = new App({
    imports: [
        new FrameworkModule({
            debug: true,
            migrateOnStartup: true
        }),
        new ServerModule()
    ],
    providers: [SQLiteDatabase, UserService],

})

app.listen(httpWorkflow.onControllerError, (e) => {
    if (e.error instanceof HttpError) {
        e.send(new Response(e.error.message, "text/plain").status(e.error.httpCode))

    }

    e.send(new Response("Internal server error", "text/plain").status(500))
})

app.run()