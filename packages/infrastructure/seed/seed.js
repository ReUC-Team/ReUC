import { PrismaClient } from "@prisma/client";
import { applicationSeedData } from "./application.seed.js";
import { facultySeedData } from "./faculty.seed.js";
import { fileSeedData } from "./file.seed.js";
import { outsiderSeedData } from "./outsider.seed.js";
import { studentSeedData } from "./student.seed.js";
import { professorSeedData } from "./professor.seed.js";
import { problemTypeSeedData } from "./problemType.seed.js";
import { professorRoleSeedData } from "./professorRole.seed.js";
import { seedProjectTypeModel } from "./projectType.seed.js";
import { studentStatusSeedData } from "./studentStatus.seed.js";
import { userStatusSeedData } from "./userStatus.seed.js";
import { teamRoleSeedData } from "./teamRole.seed.js";

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
  await prisma.team_Member.deleteMany();
  await prisma.project.deleteMany();
  // ------- APPLICATION -------
  await prisma.application_Faculty.deleteMany();
  await prisma.application_Problem_Type.deleteMany();
  await prisma.application_Project_Type.deleteMany();
  await prisma.application.deleteMany();
  // ------- USER -------
  await prisma.admin.deleteMany();
  await prisma.student.deleteMany();
  await prisma.outsider.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.user.deleteMany();
  // ------- FILES -------
  await prisma.file_Link.deleteMany();
  await prisma.file.deleteMany();
  // ------- CATALOGS -------
  await prisma.project_Type_Role_Constraint.deleteMany();
  await prisma.team_Role.deleteMany();
  await prisma.project_Type.deleteMany();
  await prisma.faculty.deleteMany();
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
    prisma.problem_Type.createMany({ data: problemTypeSeedData }),
    prisma.user_Status.createMany({ data: userStatusSeedData }),
    prisma.student_Status.createMany({ data: studentStatusSeedData }),
    prisma.professor_Role.createMany({ data: professorRoleSeedData }),
    prisma.faculty.createMany({ data: facultySeedData }),
    prisma.team_Role.createMany({ data: teamRoleSeedData }),
  ]);
  await seedProjectTypeModel();
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
      admin: {
        create: {},
      },
    },
  });
};

/**
 * Seeds the database with a large amount of dummy data for testing.
 */
async function seedDummyData() {
  // --- FETCH CATALOGS FIRST ---
  console.log("  - Fetching catalog data for seeding dummy users...");
  const allStudentStatus = await prisma.student_Status.findMany();
  const allProfessorRoles = await prisma.professor_Role.findMany();

  // ======================= USERS =======================
  console.log(
    "  - Generating dummy user data (outsiders, students, professors)..."
  );

  // Define limits for each role
  const outsiderLimit = 10;
  const studentLimit = 15;
  const professorLimit = 5;

  const [outsidersToCreate, studentsToCreate, professorsToCreate] =
    await Promise.all([
      outsiderSeedData(outsiderLimit),
      studentSeedData(studentLimit, outsiderLimit, allStudentStatus),
      professorSeedData(
        professorLimit,
        outsiderLimit + studentLimit,
        allProfessorRoles
      ),
    ]);

  const allUsersToCreate = [
    ...outsidersToCreate,
    ...studentsToCreate,
    ...professorsToCreate,
  ];

  if (allUsersToCreate.length > 0) {
    await Promise.all(
      allUsersToCreate.map((user) => prisma.user.create({ data: user }))
    );
    console.log(
      `  - Created ${outsidersToCreate.length} dummy users/outsiders.`
    );
    console.log(`  - Created ${studentsToCreate.length} dummy users/students.`);
    console.log(
      `  - Created ${professorsToCreate.length} dummy users/professors.`
    );
  } else {
    console.log("  - No dummy users to create.");
  }
  // ======================= APPLICATIONS =======================
  console.log("  - Generating dummy application data...");
  const allUsers = await prisma.user.findMany({ take: outsiderLimit });
  const allFaculties = await prisma.faculty.findMany();
  const allProjectTypes = await prisma.project_Type.findMany();
  const allProblemTypes = await prisma.problem_Type.findMany();

  const applicationsToCreate = applicationSeedData(
    allUsers,
    allFaculties,
    allProjectTypes,
    allProblemTypes,
    25
  );

  if (applicationsToCreate.length > 0) {
    await Promise.all(
      applicationsToCreate.map((appData) =>
        prisma.application.create({ data: appData })
      )
    );
    console.log(
      `  - Created ${applicationsToCreate.length} dummy applications.`
    );
  } else {
    console.log("  - No dummy applications to create.");
  }

  // ======================= FILE_LINKS -> APPLICATIONS =======================
  console.log("  - Linking asset files to new applications...");
  const createdApplications = await prisma.application.findMany({
    select: { uuid_application: true },
  });
  const assetFiles = await prisma.file.findMany({
    where: { isAsset: true },
    select: { uuid_file: true },
  });

  if (createdApplications.length > 0 && assetFiles.length > 0) {
    const fileLinksToCreate = [];

    for (const app of createdApplications) {
      const randomFile =
        assetFiles[Math.floor(Math.random() * assetFiles.length)];

      fileLinksToCreate.push({
        modelTarget: "APPLICATION",
        uuidTarget: app.uuid_application,
        purpose: "BANNER",
        uuidFile: randomFile.uuid_file,
      });
    }

    const { count } = await prisma.file_Link.createMany({
      data: fileLinksToCreate,
      skipDuplicates: true,
    });
    console.log(`  - Created ${count} file links for banners.`);
  } else {
    console.log(
      "  - Skipping file linking (no applications or asset files found)."
    );
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
  await runTask("Seeding dummy data", seedDummyData);
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
