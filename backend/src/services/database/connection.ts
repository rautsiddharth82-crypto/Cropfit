import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cropfit';
    if (mongoose.connection.readyState >= 1) return;

    await mongoose.connect(MONGODB_URI);
    console.log(`🌾 MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${(error as Error).message}`);
    // Non-fatal if we want to fallback or keep trying
  }
};
