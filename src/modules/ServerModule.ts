import { createModule } from "@deepkit/app";
import { AuthController } from "../controllers";

export class ServerModule extends createModule({
  controllers: [AuthController],
}) {}
