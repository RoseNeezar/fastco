import glob from "glob";
import mongoose from "mongoose";
import path from "path";

const runMigrations = async () => {
  try {
    const migrationFiles = glob.sync("src/migrations/*.ts");
    await mongoose.connect("mongodb://root:example@localhost:28017");

    for (const migrationFile of migrationFiles) {
      const migration = await import(path.resolve(migrationFile));

      if (typeof migration.up === "function") {
        await migration.up();
        console.log(`Up Migration executed: ${migrationFile}`);
      } else {
        console.log(`No up export found in: ${migrationFile}`);
      }
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

runMigrations();
