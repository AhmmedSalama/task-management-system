require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥');
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Start Server
const server = app.listen(PORT, () => {
  console.log(
    `🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});