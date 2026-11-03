import 'dotenv/config';
import express from 'express';
import { connectToMongoDB, disconnectFromMongoDB } from './connection.mjs';

const app = express();
const port = Number(process.env.PORT || 3001);

app.get('/api/health', async (_request, response) => {
  try {
    const { database } = await connectToMongoDB();
    await database.command({ ping: 1 });
    response.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    response.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

const server = app.listen(port, () => {
  console.log(`NoiRave MongoDB connector listening on http://localhost:${port}`);
});

async function shutdown() {
  server.close(async () => {
    await disconnectFromMongoDB();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
