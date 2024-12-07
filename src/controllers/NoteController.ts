import { HttpBody, http } from '@deepkit/http';
import { NoteService } from '../providers/NoteService';
import { Note } from '../models/Note';
import { User } from '../models';

export class NoteController {
    constructor(private noteService: NoteService) {}

    @(http.POST('note/add').group('notes'))
    async addNote(note: HttpBody<Note>) {
        const createdNote = await this.noteService.insertNote(note);
        return {
            id: createdNote.id,
            created_at: createdNote.created_at,
            name: createdNote.name,
            payload: createdNote.payload,
            user_id: createdNote.user_id,
        };
    }

    @(http.POST('note/delete').group('notes'))
    async deleteNote(id: HttpBody<number>) {
        return this.noteService.deleteNote(id);
    }

    @(http.POST('note/get').group('notes'))
    async getNotes(user: HttpBody<User>) {
        return await this.noteService.getNotes(user);
    }
}
