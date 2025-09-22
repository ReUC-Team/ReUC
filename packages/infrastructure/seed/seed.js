import { PrismaClient } from "../generated/prisma/client.js";
import { projectTypeSeedData } from "./projectType.seed.js";
import { problemTypeSeedData } from "./problemType.seed.js";
import { userStatusSeedData } from "./userStatus.seed.js";
import { studentStatusSeedData } from "./studentStatus.seed.js";
import { professorRoleSeedData } from "./professorRole.seed.js";
import { fileSeedData } from "./file.seed.js";
import { userSeedData } from "./user.seed.js";
import { facultySeedData } from "./faculty.seed.js";

const prisma = new PrismaClient();

async function runTask(taskName, task) {
  console.log(`\nStarting: ${taskName}...`);
  const startTime = performance.now();
  await task();
  const endTime = performance.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  console.log(`Finished: ${taskName} in ${duration}s.`);
}

/**
 * Clears all data from the database.
 * The deletion order is crucial to avoid foreign key constraint violations.
 */
async function clearDatabase() {
  // Start from tables that have foreign keys and move towards the tables they reference.
  await prisma.file_Link.deleteMany();
  await prisma.application_Faculty.deleteMany();
  await prisma.application_Problem_Type.deleteMany();
  await prisma.application_Project_Type.deleteMany();
  await prisma.application.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.outsider.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.file.deleteMany();
  await prisma.project_Type.deleteMany();
  await prisma.problem_Type.deleteMany();
  await prisma.user_Status.deleteMany();
  await prisma.student_Status.deleteMany();
  await prisma.professor_Role.deleteMany();
}

/**
 * Seeds the "catalog" tables. These are lookup tables with predefined values
 * and no dependencies on other tables, so they can be seeded in parallel.
 */
async function seedCatalogs() {
  await Promise.all([
    prisma.project_Type.createMany({ data: projectTypeSeedData }),
    prisma.problem_Type.createMany({ data: problemTypeSeedData }),
    prisma.user_Status.createMany({ data: userStatusSeedData }),
    prisma.student_Status.createMany({ data: studentStatusSeedData }),
    prisma.professor_Role.createMany({ data: professorRoleSeedData }),
    prisma.faculty.createMany({ data: facultySeedData }),
  ]);
}

/**
 * Seeds essential core data for the application, like the default admin user.
 */
const seedCoreData = async () => {
  console.log("  - Generating default file assets...");
  await prisma.file.createMany({ data: fileSeedData });
  console.log("  - Generating default user admins...");
  await prisma.user.create({
    data: {
      email: "alex.jeraza@gmail.com",
      password: "$2b$15$9VKuYMoE0/X/q/9hQFskUeRVXo.tgxnl4/CH9kks4crzB22ltAq1O",
      admins: {
        create: {},
      },
    },
  });
};

/**
 * Seeds the database with a large amount of dummy data for testing.
 */
async function seedDummyData() {
  console.log("  - Generating dummy user data...");
  const dummyUsers = await userSeedData();
  if (dummyUsers.length > 0) {
    const { count } = await prisma.user.createMany({ data: dummyUsers });
    console.log(`  - Created ${count} dummy users.`);
  } else {
    console.log("  - No dummy users to create.");
  }
}

/**
 * Main seeding function that orchestrates the entire process.
 */
async function main() {
  console.log("\nStarting database seeding...");

  await runTask("Clearing database", clearDatabase);
  await runTask("Seeding catalog data", seedCatalogs);
  await runTask("Seeding core data", seedCoreData);
  // await runTask("Seeding dummy data", seedDummyData);
  console.log("\nSeeding complete! The database is ready.");
}

main()
  .catch((e) => {
    console.error("\nAn error occurred during seeding:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
