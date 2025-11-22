import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

/**
 * Selects a random sample of items from an array.
 */
const getRandomSample = (arr, count) => {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Main function to seed Projects and their Team Members.
 * @param {PrismaClient} prisma
 */
export async function projectSeed(prisma) {
  console.log("  - Fetching data for Project seeding...");

  // 1. Fetch necessary catalogs and users
  const [students, professors, teamRoles, projectTypes] = await Promise.all([
    prisma.student.findMany({ select: { uuidUser: true } }),
    prisma.professor.findMany({ select: { uuidUser: true } }),
    prisma.team_Role.findMany(),
    prisma.project_Type.findMany({
      include: {
        roleConstraints: true,
      },
    }),
  ]);

  const roleMap = new Map(teamRoles.map((r) => [r.team_role_id, r.slug]));

  // 2. Fetch Applications that DON'T have a project yet
  const applications = await prisma.application.findMany({
    where: { project: null },
    include: {
      applicationProjectType: true,
      author: {
        include: { outsider: true, professor: true },
      },
    },
  });

  console.log(
    `  - Found ${applications.length} candidate applications for projects.`
  );

  const projectsToCreate = [];
  const teamMembersToCreate = [];

  // Counters for logging
  let appsSkipped = 0;
  let teamsSkipped = 0;

  // 3. Iterate applications and build Project + Team
  for (const app of applications) {
    // Rule: Author must be Outsider or Professor (Double check)
    const isAuthorValid = !!(app.author.outsider || app.author.professor);
    if (!isAuthorValid) continue;

    if (!app.applicationProjectType || app.applicationProjectType.length === 0)
      continue;

    // SCENARIO 1: Leave some Applications WITHOUT Projects
    // 20% chance to NOT create a project
    if (Math.random() < 0.2) {
      appsSkipped++;
      continue;
    }

    // Identify Project Type
    const typeId = app.applicationProjectType[0].projectType;
    const projectTypeConfig = projectTypes.find(
      (pt) => pt.project_type_id === typeId
    );
    if (!projectTypeConfig) continue;

    const projectId = faker.string.uuid();

    projectsToCreate.push({
      uuid_project: projectId,
      uuidApplication: app.uuid_application,
      // statusId: 1 // Optional: Set a default status if needed
    });

    // SCENARIO 2: Leave some Projects WITHOUT Teams
    // 10% chance to create the project but NO team members
    if (Math.random() < 0.1) {
      teamsSkipped++;
      continue;
    }

    // --- Build Team Members based on Constraints ---
    const usedUserIds = new Set();

    for (const constraint of projectTypeConfig.roleConstraints) {
      const roleSlug = roleMap.get(constraint.teamRoleId);

      // Determine count. If max is null, cap at min+2
      const max = constraint.maxCount || constraint.minCount + 2;
      const countToGen =
        Math.floor(Math.random() * (max - constraint.minCount + 1)) +
        constraint.minCount;

      if (countToGen === 0) continue;

      // Rule: Students = Members, Professors = Advisors/Researchers
      let candidatePool = roleSlug === "member" ? students : professors;

      // Filter out users already in this team
      const availableCandidates = candidatePool.filter(
        (u) => !usedUserIds.has(u.uuidUser)
      );

      const selectedUsers = getRandomSample(availableCandidates, countToGen);

      selectedUsers.forEach((u) => {
        usedUserIds.add(u.uuidUser);
        teamMembersToCreate.push({
          uuidProject: projectId,
          uuidUser: u.uuidUser,
          roleId: constraint.teamRoleId,
        });
      });
    }
  }

  // 4. Perform Database Inserts
  if (projectsToCreate.length > 0) {
    console.log(
      `  - Creating ${projectsToCreate.length} Projects (Skipped ${appsSkipped} apps to simulate no-project scenario).`
    );
    await prisma.project.createMany({ data: projectsToCreate });

    if (teamMembersToCreate.length > 0) {
      console.log(
        `  - Creating ${teamMembersToCreate.length} Team Members (Skipped teams for ${teamsSkipped} projects).`
      );
      await prisma.team_Member.createMany({ data: teamMembersToCreate });
    }
  } else {
    console.log("  - No projects created.");
  }
}
