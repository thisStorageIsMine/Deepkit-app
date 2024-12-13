import {
    HttpBadRequestError,
    RouteParameterResolver,
    RouteParameterResolverContext,
} from '@deepkit/http';
import { SQLiteDatabase } from '../modules';
import { User } from '../models';
import { is } from '@deepkit/type';

export class UserResolver implements RouteParameterResolver {
    constructor(protected database: SQLiteDatabase) {}

    async resolve(context: RouteParameterResolverContext) {
        const useId = context.parameters.user_id;

        if (!context.parameters.id) throw new HttpBadRequestError('User_id was not provided');

        if (is<number>(useId)) {
            throw new HttpBadRequestError('Wrong user_id type');
        }

        const user = await this.database
            .query(User)
            .filter({ id: Number(useId) })
            .findOneOrUndefined();

        if (user === undefined) {
            throw new HttpBadRequestError();
        }

        return user;
    }
}
