import { HttpBody, http } from '@deepkit/http';
import { NoteService } from '../providers/NoteService';
import { Note } from '../models/Note';

export class NoteController {
    constructor(private noteService: NoteService) {}

    @http.POST('note/add')
    async addNote(note: HttpBody<Note>) {
        const createdNote = await this.noteService.insertNote(note);
        return {
            id: createdNote.id,
            created_at: createdNote.created_at,
            name: createdNote.name,
            payload: createdNote.payload,
            last_edit: createdNote.last_edit,
            user_id: createdNote.user_id,
        };
    }
}
