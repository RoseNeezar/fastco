import glob from "glob";
import mongoose from "mongoose";
import path from "path";

const revertMigrations = async () => {
  try {
    const migrationFiles = glob.sync("src/migrations/*.ts");
    await mongoose.connect("mongodb://root:example@localhost:27017");

    for (const migrationFile of migrationFiles) {
      const migration = await import(path.resolve(migrationFile));

      if (typeof migration.down === "function") {
        await migration.down();
        console.log(`Down Migration executed: ${migrationFile}`);
      } else {
        console.log(`No down export found in: ${migrationFile}`);
      }
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

revertMigrations();
