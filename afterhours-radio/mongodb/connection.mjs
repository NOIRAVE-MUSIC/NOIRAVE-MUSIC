import { MongoClient, ServerApiVersion } from 'mongodb';

let client;
let connectionPromise;

export async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<db_username>') || uri.includes('<db_password>')) {
    throw new Error('Set MONGODB_URI in mongodb/.env with your Atlas database credentials.');
  }

  if (!connectionPromise) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    connectionPromise = client.connect().catch((error) => {
      connectionPromise = undefined;
      client = undefined;
      throw error;
    });
  }

  await connectionPromise;
  const database = client.db(process.env.MONGODB_DB_NAME || 'noirave');
  await database.command({ ping: 1 });
  return { client, database };
}

export async function disconnectFromMongoDB() {
  if (!client) return;
  await client.close();
  client = undefined;
  connectionPromise = undefined;
}
