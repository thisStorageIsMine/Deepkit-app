import { HttpBody, HttpQuery, HttpRequest, HttpResponse, http } from '@deepkit/http';
import { NoteService } from '../providers/NoteService';
import { Note } from '../models/Note';
import { AuthBody } from '../bodies';

import { GuardService } from '../providers/GuardService';
export type TNoteBody = {
    name: string;
    payload: string;
};

export class NoteController {
    constructor(
        private noteService: NoteService,
        private guard: GuardService,
    ) {}

    @(http.POST('note/add').OPTIONS('note/add').group('notes'))
    async addNote(note: HttpBody<TNoteBody & AuthBody>, user_id: HttpQuery<number>) {
        const user = await this.guard.getUser(user_id);
        const createdNote = await this.noteService.insertNote({ ...note, user_id: user });

        return {
            id: createdNote.id,
            created_at: createdNote.created_at,
            name: createdNote.name,
            payload: createdNote.payload,
            user_id: createdNote.user_id,
        };
    }

    @(http.POST('note/delete').OPTIONS('note/delete').group('notes'))
    async deleteNote(body: HttpBody<AuthBody>, id: HttpQuery<number>) {
        return this.noteService.deleteNote(id);
    }

    @(http.POST('note/get').OPTIONS('note/get').group('notes'))
    async getNotes(user_id: HttpQuery<number>, body: HttpBody<AuthBody>) {
        return await this.noteService.getNotes(user_id);
    }
}
