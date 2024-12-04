import { Database } from '@deepkit/orm';
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';
import { User } from '../models';

export class SQLiteDatabase extends Database {
    constructor() {
        super(new SQLiteDatabaseAdapter('../../db.sqlite'), [User]);
    }
}
