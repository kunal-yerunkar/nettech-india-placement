import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nettech_placement';
const isProduction = process.env.NODE_ENV === 'production';

// Fail fast if MONGODB_URI is not set in production
if (isProduction && (!MONGODB_URI || MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1'))) {
  console.error('ERROR: MONGODB_URI must be set to a production database in production environment.');
  process.exit(1);
}

const connectionOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, connectionOptions);
    console.log('✅ MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        setTimeout(() => connectDB(), RETRY_DELAY * retryCount);
      } else {
        console.error('Max retry attempts reached. Please check your database connection.');
        process.exit(1);
      }
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      console.log(`Retrying connection (${retryCount}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
      return connectDB();
    } else {
      console.error('Max retry attempts reached. Exiting...');
      process.exit(1);
    }
  }
};
