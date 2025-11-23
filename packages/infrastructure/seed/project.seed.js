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

  // ---------- Fetch necessary catalogs and users ----------
  const [
    students,
    professors,
    teamRoles,
    projectTypes,
    projectStatuses,
    appStatuses,
  ] = await Promise.all([
    prisma.student.findMany({ select: { uuidUser: true } }),
    prisma.professor.findMany({ select: { uuidUser: true } }),
    prisma.team_Role.findMany(),
    prisma.project_Type.findMany({ include: { roleConstraints: true } }),
    prisma.project_Status.findMany(),
    prisma.application_Status.findMany(),
  ]);

  const roleMap = new Map(teamRoles.map((r) => [r.team_role_id, r.slug]));

  const appApproved = appStatuses.find((s) => s.slug === "approved");
  const projApproved = projectStatuses.find(
    (s) => s.slug === "project_approved"
  );
  const projInProgress = projectStatuses.find(
    (s) => s.slug === "project_in_progress"
  );

  if (!appApproved || !projApproved || !projInProgress) {
    console.error(
      "  x Critical: Missing required status slugs (approved, project_approved, project_in_progress)."
    );
    return;
  }

  // ---------- Fetch Applications that DON'T have a project yet ----------
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
  const appUuidsToUpdate = [];

  let appsSkipped = 0; // Remained "In Review"
  let projectsWaiting = 0; // Became "Approved" but no team
  let projectsStarted = 0; // Became "In Progress" with team
  let teamsSkipped = 0;

  // ---------- Iterate applications and build Project + Team ----------
  for (const app of applications) {
    // Rule: Author must be Outsider or Professor (Double check)
    const isAuthorValid = !!(app.author.outsider || app.author.professor);
    if (!isAuthorValid) continue;
    // Rule: Applications must have at least one Project Type
    if (!app.applicationProjectType?.length) continue;

    // DECISION 1: Does this Application get Approved?
    // 20% chance to remain "In Review" (rejected/ignored)
    if (Math.random() < 0.2) {
      appsSkipped++;
      continue;
    }

    // Rule: Project must be of one type and be valid
    const typeId = app.applicationProjectType[0].projectType;
    const projectTypeConfig = projectTypes.find(
      (pt) => pt.project_type_id === typeId
    );
    if (!projectTypeConfig) continue;

    // --- LOGIC: DETERMINE CREATOR (APPROVER) ---
    let creatorUuid;

    // Case A: Author is a Professor -> They approve their own app (Self-Approval)
    if (app.author.professor) {
      creatorUuid = app.uuidAuthor;
    } else {
      // Case B: Author is Student/Outsider -> Random Professor approves it
      const randomProf =
        professors[Math.floor(Math.random() * professors.length)];
      creatorUuid = randomProf.uuidUser;
    }

    const projectId = faker.string.uuid();

    appUuidsToUpdate.push(app.uuid_application);

    // DECISION 2: Does this Project get a Team assigned immediately?
    // 10% chance it is Approved but waiting for a team.
    const hasTeam = Math.random() >= 0.1;

    let targetProjectStatusId;

    if (!hasTeam) {
      targetProjectStatusId = projApproved.project_status_id;
      projectsWaiting++;
    } else {
      targetProjectStatusId = projInProgress.project_status_id;
      projectsStarted++;
    }

    // Add Project to Batch
    projectsToCreate.push({
      uuid_project: projectId,
      uuidApplication: app.uuid_application,
      statusId: targetProjectStatusId,
      uuidCreator: creatorUuid,
    });

    // --- Build Team Members ---
    const usedUserIds = new Set();

    // 1. ADD CREATOR (MANDATORY - Advisor/Researcher)
    const constraints = projectTypeConfig.roleConstraints;
    const hasResearcher = constraints.some(
      (c) => roleMap.get(c.teamRoleId) === "researcher"
    );
    const creatorRoleSlug = hasResearcher ? "researcher" : "advisor";
    const creatorRoleObj = teamRoles.find((r) => r.slug === creatorRoleSlug);

    if (creatorRoleObj) {
      teamMembersToCreate.push({
        uuidProject: projectId,
        uuidUser: creatorUuid,
        roleId: creatorRoleObj.team_role_id,
      });
      usedUserIds.add(creatorUuid);
    }

    // 2. FILL REMAINING TEAM (Only if hasTeam is true)
    if (hasTeam) {
      for (const constraint of projectTypeConfig.roleConstraints) {
        const roleSlug = roleMap.get(constraint.teamRoleId);

        const max = constraint.maxCount || constraint.minCount + 2;
        let countToGen =
          Math.floor(Math.random() * (max - constraint.minCount + 1)) +
          constraint.minCount;

        if (countToGen === 0) continue;

        let candidatePool = roleSlug === "member" ? students : professors;

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
    } else {
      teamsSkipped++;
    }
  }

  // ---------- Perform Database Inserts ----------
  if (projectsToCreate.length > 0) {
    console.log(`  - Summary:`);
    console.log(`    > ${appsSkipped} Apps left 'In Review'`);
    console.log(
      `    > ${projectsWaiting} Projects created as 'Approved' (No Team)`
    );
    console.log(
      `    > ${projectsStarted} Projects created as 'In Progress' (With Team)`
    );

    // A. Create Projects
    await prisma.project.createMany({ data: projectsToCreate });

    // B. Create Team Members
    if (teamMembersToCreate.length > 0) {
      await prisma.team_Member.createMany({ data: teamMembersToCreate });
    }

    // C. Update Applications to "Approved"
    if (appUuidsToUpdate.length > 0) {
      await prisma.application.updateMany({
        where: { uuid_application: { in: appUuidsToUpdate } },
        data: { statusId: appApproved.application_status_id },
      });
    }
  } else {
    console.log("  - No projects created.");
  }
}
