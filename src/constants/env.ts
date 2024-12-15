import AppError from "../utills/appError";

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new AppError(500, `Evironme variable is missing: ${key}`);
  }
  
  return value;
}

export const MONGO_URI = getEnv('MONGO_URI');
export const PORT = getEnv('PORT', '3000');
export const OPEN_AI_API_KEY = getEnv('OPEN_AI_API_KEY');
export const ANTHROPIC_API_KEY = getEnv('ANTHROPIC_API_KEY');
export const NODE_ENV = getEnv('NODE_ENV', 'development');