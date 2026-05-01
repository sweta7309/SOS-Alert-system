require('dotenv').config();
const mongoose = require('mongoose');

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");
  
  const User = require('./src/models/User');
  const users = await User.find();
  console.log("Users found:", users.length);
  for (const u of users) {
    console.log(`User: ${u.name}, Phone: ${u.phone}`);
    console.log(`Emergency Contacts:`, u.emergencyContacts);
  }
  process.exit(0);
}

checkDB();
