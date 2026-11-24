import mongoose, { Document, Model, Schema } from 'mongoose';

function resolveSectionDbName(sectionKey: string): string | undefined {
  const normalized = sectionKey.toUpperCase();
  return process.env[`DB_NAME_${normalized}`] || process.env[`MONGO_DB_${normalized}`];
}

export function getSectionModel<T extends Document>(
  modelName: string,
  schema: Schema<T>,
  sectionKey: string
): Model<T> {
  const dbName = resolveSectionDbName(sectionKey)?.trim();
  const connection = dbName
    ? mongoose.connection.useDb(dbName, { useCache: true })
    : mongoose.connection;

  if (connection.models[modelName]) {
    return connection.models[modelName] as Model<T>;
  }

  return connection.model<T>(modelName, schema);
}
