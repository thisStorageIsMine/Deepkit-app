import { cast } from '@deepkit/type';
import { Note } from '../models/Note';
import { SQLiteDatabase } from '../modules';
import { User } from '../models';
import { HttpError } from '@deepkit/http';

export class NoteService {
    constructor(private db: SQLiteDatabase) {}

    public async insertNote(data: { name: string; payload: string; user_id: User }) {
        const note = cast<Note>(data);

        const session = this.db.createSession();
        await this.db.persist(note);

        return note;
    }

    public async updateNote(data: Note) {
        const note = cast<Note>(data);

        await this.db
            .query(Note)
            .filter({ id: note.id })
            .patchOne({ name: note.name, payload: note.payload, last_edit: new Date() });
    }

    public async deleteNote(id: number) {
        return await this.db.query(Note).filter({ id }).deleteOne();
    }

    public async getNotes(userId: number) {
        const user = await this.db.query(User).filter({ id: userId }).findOneOrUndefined();
        if (!user) {
            throw new HttpError('There is no such user', 403);
        }

        return await this.db.query(Note).filter({ user_id: user }).find();
    }
}
