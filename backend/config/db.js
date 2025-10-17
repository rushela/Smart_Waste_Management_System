const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('\n💡 Quick Fix:');
    console.error('   1. For MongoDB Atlas: Add your IP to Network Access whitelist');
    console.error('   2. For local development: Install MongoDB locally');
    console.error('      brew install mongodb-community@7.0');
    console.error('      brew services start mongodb-community@7.0');
    console.error('   3. Update MONGO_URI in .env to: mongodb://localhost:27017/waste_management');
    console.error('\n   See MONGODB_FIX.md for detailed instructions\n');
    process.exit(1);
  }
};

module.exports = connectDB;
