require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const app = express();

// Connect to the database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;
const BASE_URI = process.env.BASE_URI || '/api/v1';

// Import routes
const apiRoutes = require('./src/routes/apiRoutes');
app.use(process.env.BASE_URI, apiRoutes);
const chefRoutes = require('./src/routes/chefRoutes');
app.use(process.env.BASE_URI, chefRoutes);
const authRoutes = require('./src/routes/authRoutes');
app.use(`${BASE_URI}/auth`, authRoutes);

// ONLY start the server if we are NOT running tests
let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

// Export the app so Supertest can use it!
 module.exports = app;
