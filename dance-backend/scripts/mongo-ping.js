const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const uri = process.env.DATABASE_URL;

if (!uri) {
  console.error('DATABASE_URL is not set. Add it to dance-academy-app/.env');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    await client.close();
  }
}

run().catch((err) => {
  console.error('MongoDB ping failed:', err);
  process.exit(1);
});
