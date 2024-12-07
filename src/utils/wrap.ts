export const wrap = <T>(promise: Promise<T>): Promise<[T, null] | [null, string]> => {
    return Promise.allSettled([promise]).then(([resolved]) => {
        if (resolved.status === 'fulfilled') {
            return [resolved.value, null];
        }
        return [null, resolved.reason];
    });
};
