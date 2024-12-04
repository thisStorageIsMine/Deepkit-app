export const omit = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[],
): Omit<T, K> => {
    let omittedObj: Partial<T> = { ...obj };
    keys.forEach((key) => delete omittedObj[key]);

    return omittedObj as Omit<T, K>;
};
