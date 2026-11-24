// Copies legacy `danceacademy` collections into the collections the current backend reads.
// Dry-run by default; pass --apply to write. Safe to re-run: existing documents are never overwritten.
// Usage: node scripts/import-legacy-danceacademy.js [--apply] [--source=danceacademy]
const path = require('path');
const { mongo } = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const apply = process.argv.includes('--apply');
const sourceName = (process.argv.find((a) => a.startsWith('--source=')) || '--source=danceacademy').split('=')[1];
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is not set in dance-backend/.env');
  process.exit(1);
}

const active = { active: true, isActive: true };

const mappings = [
  {
    from: 'programs',
    to: 'programs',
    map: (d, i) => ({ ...d, ...active, order: i }),
  },
  {
    from: 'staffs',
    to: 'staffmembers',
    map: (d, i) => ({ ...d, ...active, order: i }),
  },
  {
    from: 'galleryitems',
    to: 'galleries',
    map: (d, i) => ({
      title: d.title,
      thumbnail: d.img,
      images: d.img ? [d.img] : [],
      ...active,
      order: i,
      createdAt: d.createdAt || d.uploadedAt || new Date(),
      updatedAt: d.updatedAt || new Date(),
    }),
  },
  {
    // /api/content serves the `contents` collection, which the News page reads.
    from: 'news',
    to: 'contents',
    map: (d) => {
      const parsed = new Date(d.date);
      return {
        title: d.title,
        description: d.body || '',
        imageUrl: (d.images && d.images[0]) || '',
        updatedAt: Number.isNaN(parsed.getTime()) ? d.createdAt || new Date() : parsed,
      };
    },
  },
];

const notImported = ['products', 'sitesettings', 'users'];

async function run() {
  const client = new mongo.MongoClient(uri);
  await client.connect();
  try {
    const target = client.db();
    const source = client.db(sourceName);
    console.log(`${apply ? 'APPLY' : 'DRY-RUN'}: ${sourceName} -> ${target.databaseName}`);
    if (target.databaseName === sourceName) {
      throw new Error('Source and target database are the same; aborting.');
    }

    for (const { from, to, map } of mappings) {
      const docs = await source.collection(from).find().sort({ createdAt: 1, _id: 1 }).toArray();
      const ids = docs.map((d) => d._id);
      const existing = await target.collection(to).countDocuments({ _id: { $in: ids } });
      console.log(`${from} -> ${to}: ${docs.length} source, ${existing} already present, ${docs.length - existing} to insert`);

      if (!apply) continue;
      for (let i = 0; i < docs.length; i++) {
        const { _id, ...rest } = map(docs[i], i);
        await target.collection(to).updateOne({ _id: docs[i]._id }, { $setOnInsert: rest }, { upsert: true });
      }
    }

    for (const c of notImported) {
      console.log(`${c}: not imported (${await source.collection(c).countDocuments()} docs left in ${sourceName})`);
    }
  } finally {
    await client.close();
  }
}

run().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
