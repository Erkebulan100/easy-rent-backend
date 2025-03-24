require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

console.log("ENV loaded from .env");
console.log("OPENAI_API_KEY ends with:", process.env.OPENAI_API_KEY?.slice(-6));
console.log("OPENAI_PROJECT_ID:", process.env.OPENAI_PROJECT_ID);

if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️ OPENAI_API_KEY is missing! Check your .env file.");
}

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});