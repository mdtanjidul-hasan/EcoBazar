import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

let mongod: MongoMemoryServer;

export const connectDB = async () => {
  try {
    const dbPath = path.join(process.cwd(), '.mongo');
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(dbPath, { recursive: true });
    }

    const lockFile = path.join(dbPath, 'mongod.lock');
    if (fs.existsSync(lockFile)) {
      try { fs.unlinkSync(lockFile); } catch (e) {}
    }

    mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbPath: dbPath,
        storageEngine: 'wiredTiger',
      },
      spawnOpts: {
        timeout: 60000
      }
    });

    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('MongoDB Memory Server connected at', uri);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

