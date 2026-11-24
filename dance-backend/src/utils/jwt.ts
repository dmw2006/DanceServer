import '../config/env';

export const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET || 'local-dev-secret';
    return secret;
};
