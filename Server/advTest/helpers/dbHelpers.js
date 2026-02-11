import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

export const setupTestDB = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return uri;
};

export const teardownTestDB = async () => {
  if (mongoose.connection.readyState) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongod) await mongod.stop();
};

export const seedCollections = async (collections = {}) => {
  const tasks = Object.entries(collections).map(([Model, docs]) => {
    const M = mongoose.model(Model) || Model;
    return M.insertMany(docs);
  });
  await Promise.all(tasks);
};

export const clearCollections = async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(
    Object.values(collections).map((c) => c.deleteMany({}))
  );
};
