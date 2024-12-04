import { AutoIncrement, PrimaryKey, Reference, entity } from '@deepkit/type';
import { User } from './User';

@entity.name('notes')
export class Note {
    id: number & PrimaryKey & AutoIncrement = 0;
    created_at: Date = new Date();

    constructor(
        public user_id: User & Reference,
        public name: string,
        public payload: string,
        public last_edit: Date,
    ) {}
}
