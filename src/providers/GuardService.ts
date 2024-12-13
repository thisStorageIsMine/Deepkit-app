import { HttpBadRequestError } from '@deepkit/http';
import { User } from '../models';
import { SQLiteDatabase } from '../modules';

export class GuardService {
    constructor(private db: SQLiteDatabase) {}

    async getUser(userId: number) {
        const user = await this.db.query(User).filter({ id: userId }).findOneOrUndefined();

        if (!user) {
            throw new HttpBadRequestError();
        }

        return user;
    }
}
