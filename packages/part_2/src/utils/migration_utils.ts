import mongoose from "mongoose";

export const hasMigrationBeenExecuted = async (
  migrationName: string
): Promise<boolean> => {
  const migrationCollection =
    mongoose.connection.collection("migration_history");
  const existingMigration = await migrationCollection.findOne({
    name: migrationName,
  });
  return !!existingMigration;
};
export const saveMigrationHistory = async (migrationName: string) => {
  const migrationCollection =
    mongoose.connection.collection("migration_history");
  await migrationCollection.insertOne({
    name: migrationName,
    executedAt: new Date(),
  });
};

export const removeMigrationHistory = async (migrationName: string) => {
  const migrationCollection =
    mongoose.connection.collection("migration_history");
  const existingMigration = await migrationCollection.findOne({
    name: migrationName,
  });
  if (existingMigration) {
    await migrationCollection.deleteOne({ _id: existingMigration._id });
    console.log("Migration history removed:", migrationName);
  } else {
    console.log("No migration history found:", migrationName);
  }
};
