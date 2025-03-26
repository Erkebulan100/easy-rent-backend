require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');
const config = require('./src/config/config');

// ✅ Use AWS-recommended PORT handling
const PORT = process.env.PORT || config.port || 5000;

console.log(`Starting server in ${config.nodeEnv} mode`);
console.log("ENV loaded from .env");
console.log("OPENAI_API_KEY ends with:", config.openaiApiKey?.slice(-6));
console.log("OPENAI_PROJECT_ID:", config.openaiProjectId);

if (!config.openaiApiKey) {
  console.warn("⚠️ OPENAI_API_KEY is missing! Check your .env file.");
}

// ✅ Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Start the Express app
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
