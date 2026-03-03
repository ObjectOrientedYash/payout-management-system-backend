import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/payout_mvp';
        await mongoose.connect(mongoUri);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('Error connecting to MongoDB', err.message);
        process.exit(1);
    }
};

export default connectDB;
