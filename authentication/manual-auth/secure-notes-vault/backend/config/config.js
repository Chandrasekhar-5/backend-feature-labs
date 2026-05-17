import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
    throw new Error('Missing PORT environment variable');
}

if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI environment variable');
}

if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('Missing REFRESH_TOKEN_SECRET environment variable');
}

if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('Missing ACCESS_TOKEN_SECRET environment variable');
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET
}

export default config;