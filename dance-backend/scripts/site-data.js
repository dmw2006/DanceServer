// Copies site content between MongoDB databases as an EJSON file (users are never included).
//   Server:  node scripts/site-data.js export > /tmp/site-data.json
//            node scripts/site-data.js export --only=programs,staffmembers,schedules --out=file.json   (only some collections, written straight to a file)
//   Local:   node scripts/site-data.js import site-data.json        (upserts by _id into MONGO_URI's database)
//            node scripts/site-data.js import site-data.json --replace  (empties each collection in the file first, so local mirrors it exactly)
//            add --append=contents to skip emptying those collections (records are only added/updated)
const fs = require('fs');
const path = require('path');
const { mongo } = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { MongoClient } = mongo;
const { EJSON } = mongo.BSON;
const COLLECTIONS = ['programs', 'staffmembers', 'galleries', 'contents', 'highlights', 'testimonials', 'schedules', 'heroslides', 'pagesettings'];

async function run() {
  const args = process.argv.slice(2);
  const replace = args.includes('--replace');
  const option = (key) => (args.find((a) => a.startsWith(`--${key}=`)) || '').split('=').slice(1).join('=');
  const only = option('only') ? option('only').split(',') : COLLECTIONS;
  const outFile = option('out');
  const append = option('append') ? option('append').split(',') : [];
  const [mode, file] = args.filter((a) => !a.startsWith('--'));
  if (!['export', 'import'].includes(mode) || (mode === 'import' && !file)) {
    console.error('Usage: node scripts/site-data.js export > file.json | import file.json');
    process.exit(1);
  }
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set in dance-backend/.env');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db();

  try {
    if (mode === 'export') {
      const out = {};
      for (const name of only) {
        if (!COLLECTIONS.includes(name)) throw new Error(`Unknown collection: ${name}`);
        out[name] = await db.collection(name).find({}).toArray();
      }
      const json = EJSON.stringify(out, { relaxed: false });
      if (outFile) fs.writeFileSync(outFile, json, 'utf8');
      else process.stdout.write(json);
      return;
    }

    const data = EJSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
    console.error(`Importing into database "${db.databaseName}"`);
    for (const name of COLLECTIONS) {
      const docs = data[name] || [];
      if (replace && data[name] && !append.includes(name)) await db.collection(name).deleteMany({});
      for (const doc of docs) await db.collection(name).replaceOne({ _id: doc._id }, doc, { upsert: true });
      console.error(`${name}: ${docs.length}`);
    }
  } finally {
    await client.close();
  }
}

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
