import { cast } from '@deepkit/type';
import { Note } from '../models/Note';
import { SQLiteDatabase } from '../modules';
import { User } from '../models';

export class NoteService {
    constructor(private db: SQLiteDatabase) {}

    public async insertNote(data: Note) {
        const note = cast<Note>(data);

        const session = this.db.createSession();
        session.add(note);

        await session.commit();

        return note;
    }

    public async updateNote(data: Note){
        const note = cast<Note>(data)

        await this.db.query(Note).filter({id: note.id}).patchOne({name: note.name, payload: note.payload, last_edit: new Date()})
    }

    public async deleteNote(id: number) {
        return await this.db.query(Note).filter({id}).deleteOne()
    }

    public async getNotes(user: User) {
        return await this.db.query(Note).filter({user_id: user}).find()
    }
}
