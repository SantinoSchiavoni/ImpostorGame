require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');
console.log('URI from .env.local:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'undefined'); // Log obfuscated URI

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => {
    console.log('✅ Connection Successful!');
    console.log('Database Name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection Failed');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.reason) console.error('Reason:', err.reason);
    console.log('\n--- Troubleshooting ---');
    console.log('1. Check if your password contains special characters (@, :, /, #). If so, they must be URL encoded.');
    console.log('2. Ensure your IP is whitelisted in MongoDB Atlas Network Access.');
    console.log('3. Verify the cluster hostname is correct.');
    process.exit(1);
  });
