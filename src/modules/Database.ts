import { Database } from '@deepkit/orm';
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';
import { User } from '../models';
import { Note } from '../models/Note';

export class SQLiteDatabase extends Database {
    name = 'main-db';
    constructor() {
        super(new SQLiteDatabaseAdapter('../../setup.sqlite'), [User, Note]);
    }
}
