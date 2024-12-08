export interface AuthBody {
    tokens: {
        access: string;
        refresh: string;
    };
}
