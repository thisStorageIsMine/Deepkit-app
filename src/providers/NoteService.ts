import { cast } from '@deepkit/type';
import { Note } from '../models/Note';
import { SQLiteDatabase } from '../modules';

export class NoteService {
    constructor(private db: SQLiteDatabase) {}

    public async insertNote(data: Note) {
        const note = cast<Note>(data);

        const session = this.db.createSession();
        session.add(note);

        await session.commit();

        return note;
    }
}
