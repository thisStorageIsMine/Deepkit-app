import { createModule } from '@deepkit/app';
import { AuthController } from '../controllers';
import { NoteController } from '../controllers/NoteController';

export class ServerModule extends createModule({
    controllers: [AuthController],
}) {}
