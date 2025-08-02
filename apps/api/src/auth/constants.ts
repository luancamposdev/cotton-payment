export const JWT_STRATEGY = 'jwt';
export const LOCAL_STRATEGY = 'local';
export const GITHUB_STRATEGY = 'github';
export const GOOGLE_STRATEGY = 'google';

export const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_in_prod';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
