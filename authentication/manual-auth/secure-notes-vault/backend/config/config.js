import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
    throw new Error('Missing PORT environment variable');
}

if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI environment variable');
}

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
}

export default config;