import mongoose from 'mongoose';

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. In Render: Environment → add MONGODB_URI (your MongoDB Atlas connection string).'
    );
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
}
