import { HttpBody, HttpQuery, HttpRequest, HttpResponse, http } from '@deepkit/http';
import { NoteService } from '../providers/NoteService';
import { Note } from '../models/Note';
import { User } from '../models';
import { AuthBody } from '../bodies';

export class NoteController {
    constructor(private noteService: NoteService) {}

    @(http.POST('note/add').group('notes'))
    async addNote(note: HttpBody<Note & AuthBody>) {
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
    async deleteNote(id: HttpBody<number & AuthBody>) {
        return this.noteService.deleteNote(id);
    }

    @(http.POST('note/get').OPTIONS('note/get').group('notes'))
    async getNotes(user_id: HttpQuery<number>, body: HttpBody<AuthBody>) {
        return await this.noteService.getNotes(user_id);
    }
}
