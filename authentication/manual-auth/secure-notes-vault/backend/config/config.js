import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
    throw new Error('Missing PORT environment variable');
}

if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI environment variable');
}

if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET environment variable');
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config;