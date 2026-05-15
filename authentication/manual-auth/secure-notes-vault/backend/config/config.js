import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
    throw new Error('Missing PORT environment variable');
}

const config = {
    PORT: process.env.PORT,
}

export default config;