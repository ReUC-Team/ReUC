import { PrismaClient } from "@prisma/client";

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
  // ------- PROJECT -------
  await prisma.project_Faculty.deleteMany();
  await prisma.project_Problem_Type.deleteMany();
  // await prisma.project_Project_Type.deleteMany();
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
 * Main clearing function that orchestrates the entire process.
 */
async function main() {
  console.log("\nStarting database data clear...");

  await runTask("Clearing database", clearDatabase);
  console.log("\nClearing complete! The database is ready.");
}

main()
  .catch((e) => {
    console.error("\nAn error occurred during clearing:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
