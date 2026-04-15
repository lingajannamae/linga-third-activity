process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// 1. Create a new memory database and connect Mongoose to it
exports.connect = async () => {
  if (mongoose.connection.readyState !== 0) return;

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
};

// 2. Drop the database, close the connection, and stop the server
exports.closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
};

// 3. Delete all data from all collections (run this between tests!)
exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};