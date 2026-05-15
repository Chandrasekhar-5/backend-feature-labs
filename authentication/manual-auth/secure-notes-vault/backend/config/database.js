import mongoose, { connect } from 'mongoose';
import config from './config.js';


async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        
        console.log('Connected to mongodb...');
    }
    catch(error) {
        console.error('Could not connect to mongodb:', error.message);
        process.exit(1);
    }
}

export default connectDB;