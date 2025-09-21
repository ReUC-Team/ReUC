// packages/infrastructure/scripts/validate-tableSchemas.js
import { PrismaClient } from "../generated/prisma/client.js";
import { tableSchemas, tableNames } from "../db/client.js";

const prisma = new PrismaClient();

const mapSqliteTypeToSchemaType = (sqliteType) => {
  const type = sqliteType.toUpperCase();
  if (type.includes("CHAR") || type.includes("TEXT") || type.includes("CLOB"))
    return "String";
  if (type === "INTEGER") return "Int";
  if (type === "BOOLEAN") return "Boolean";
  if (type === "REAL" || type === "FLOAT" || type === "DOUBLE") return "Float";
  if (type === "NUMERIC" || type === "DECIMAL") return "Float";
  if (type.includes("DATE") || type.includes("TIME")) return "DateTime";
  return "String"; // fallback
};

const getRealTableSchema = async (tableName) => {
  const columns = await prisma.$queryRawUnsafe(
    `PRAGMA table_info(${tableName});`
  );
  return columns.map((col) => ({
    name: col.name,
    dataType: mapSqliteTypeToSchemaType(col.type),
    isNullable: Number(col.notnull) === 0,
  }));
};

const main = async () => {
  let hasError = false;

  for (const [modelName, fields] of Object.entries(tableSchemas)) {
    const tableName = tableNames[modelName];
    if (!tableName) {
      console.warn(`⚠️ No table name mapping found for model '${modelName}'`);
      continue;
    }

    const realSchema = await getRealTableSchema(tableName);
    const realSchemaMap = Object.fromEntries(
      realSchema.map((col) => [
        col.name,
        { dataType: col.dataType, isNullable: col.isNullable },
      ])
    );

    if (Object.keys(fields).length === 0) {
      console.warn(`⚠️ Model '${modelName}' has no schema fields defined.`);
      continue;
    }

    for (const [prismaField, config] of Object.entries(fields)) {
      const columnName = config.nameMapped;
      if (!columnName) {
        console.warn(
          `⚠️ Field '${modelName}.${prismaField}' has empty nameMapped`
        );
        continue;
      }

      const realCol = realSchemaMap[columnName];
      if (!realCol) {
        console.error(
          `❌ Column '${columnName}' missing in DB table '${tableName}' (mapped from '${modelName}.${prismaField}')`
        );
        hasError = true;
        continue;
      }

      if (realCol.dataType !== config.dataType) {
        console.error(
          `❌ Type mismatch for '${modelName}.${prismaField}' → '${columnName}': expected '${config.dataType}', got '${realCol.dataType}'`
        );
        hasError = true;
      }

      if (realCol.isNullable !== config.isNullable) {
        console.error(
          `❌ Nullability mismatch for '${modelName}.${prismaField}' → '${columnName}': expected nullable=${realCol.isNullable}, got ${config.isNullable}`
        );
        hasError = true;
      }
    }

    for (const realColName of Object.keys(realSchemaMap)) {
      const known = Object.values(fields).some(
        (f) => f.nameMapped === realColName
      );
      if (!known) {
        console.warn(
          `⚠️ Extra column '${realColName}' exists in DB table '${tableName}' but is not mapped in '${modelName}'`
        );
      }
    }
  }

  await prisma.$disconnect();

  if (hasError) {
    console.error("❌ Schema validation failed.");
    process.exit(1);
  } else {
    console.log("✅ All schemas are correctly synced with the database.");
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
