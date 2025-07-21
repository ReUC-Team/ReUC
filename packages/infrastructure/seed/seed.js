// packages/infrastructure/seed.js
import { PrismaClient } from "../generated/prisma/client.js";
import { projectTypeSeedData } from "./projectType.seed.js";
import { userStatusSeedData } from "./userStatus.seed.js";
import { studentStatusSeedData } from "./studentStatus.seed.js";
import { professorRoleSeedData } from "./professorRole.seed.js";
import { userSeedData } from "./user.seed.js";
import { facultySeedData } from "./faculty.seed.js";

const prisma = new PrismaClient();

async function main() {
  console.time("DeleteMany");
  await prisma.project_Type.deleteMany();
  await prisma.user_Status.deleteMany();
  await prisma.student_Status.deleteMany();
  await prisma.professor_Role.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.student.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.outsider.deleteMany();
  await prisma.user.deleteMany();
  console.timeEnd("DeleteMany");
  console.time("CreateRealAdmin");
  // ====== Admin ======
  let users = await prisma.user.createManyAndReturn({
    data: [
      {
        email: "alex.jeraza@gmail.com",
        password:
          "$2b$15$9VKuYMoE0/X/q/9hQFskUeRVXo.tgxnl4/CH9kks4crzB22ltAq1O",
      },
    ],
  });
  await prisma.admin.createManyAndReturn({
    data: [{ uuidUser: users[0].uuid_user }],
  });
  console.timeEnd("CreateRealAdmin");
  console.time("CreateDummyData");
  const dummyData = await userSeedData();
  let newDummyData = { count: 0 };
  if (dummyData.length !== 0) {
    newDummyData = await prisma.user.createMany({ data: dummyData });
  }
  console.log(newDummyData.count);
  console.timeEnd("CreateDummyData");
  console.time("CreateDefaultData");
  // ====== Project_Type ======
  await prisma.project_Type.createMany({ data: projectTypeSeedData });
  // ====== User_Status ======
  await prisma.user_Status.createMany({ data: userStatusSeedData });
  // ====== User_Status ======
  await prisma.student_Status.createMany({ data: studentStatusSeedData });
  // ====== Professor_Role ======
  await prisma.professor_Role.createMany({ data: professorRoleSeedData });
  // ====== Faculty ======
  await prisma.faculty.createMany({ data: facultySeedData });
  console.timeEnd("CreateDefaultData");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
