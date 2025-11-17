import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedProjectTypeModel() {
  /**
   * 0. Miembro
   * 1. Asesor
   * 2. Co-Asesor
   * 3. Investigador
   */
  const teamRoles = await prisma.team_Role.findMany({
    orderBy: { team_role_id: "asc" },
  });

  if (teamRoles.length > 0) {
    console.log(`  - Getted ${teamRoles.length} Team Roles.`);

    const projectTypeSeedData = [
      {
        name: "Servicio Social Universitario",
        minEstimatedMonths: 6,
        maxEstimatedMonths: 6,
        requiredHours: 50,
        roleConstraints: {
          create: [
            {
              teamRole: {
                connect: { team_role_id: teamRoles[0].team_role_id },
              },
              minCount: 1,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[1].team_role_id },
              },
              minCount: 0,
            },
          ],
        },
      },
      {
        name: "Culturales y Deportivas",
        minEstimatedMonths: 6,
        maxEstimatedMonths: 6,
        requiredHours: 32,
        roleConstraints: {
          create: [
            {
              teamRole: {
                connect: { team_role_id: teamRoles[0].team_role_id },
              },
              minCount: 1,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[1].team_role_id },
              },
              minCount: 0,
            },
          ],
        },
      },
      {
        name: "Proyectos Integradores",
        minEstimatedMonths: 6,
        maxEstimatedMonths: 6,
        roleConstraints: {
          create: [
            {
              teamRole: {
                connect: { team_role_id: teamRoles[0].team_role_id },
              },
              minCount: 4,
              maxCount: 5,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[1].team_role_id },
              },
              minCount: 1,
            },
          ],
        },
      },
      {
        name: "Servicio Social Constitucional",
        minEstimatedMonths: 6,
        maxEstimatedMonths: 6,
        requiredHours: 480,
        roleConstraints: {
          create: [
            {
              teamRole: {
                connect: { team_role_id: teamRoles[0].team_role_id },
              },
              minCount: 1,
              maxCount: 4,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[1].team_role_id },
              },
              minCount: 1,
              maxCount: 1,
            },
          ],
        },
      },
      {
        name: "Tesis",
        minEstimatedMonths: 12,
        maxEstimatedMonths: 12,
        roleConstraints: {
          create: [
            {
              teamRole: {
                connect: { team_role_id: teamRoles[0].team_role_id },
              },
              minCount: 1,
              maxCount: 5,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[1].team_role_id },
              },
              minCount: 1,
              maxCount: 1,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[2].team_role_id },
              },
              minCount: 0,
              maxCount: 1,
            },
          ],
        },
      },
      {
        name: "Prácticas profesionales",
        minEstimatedMonths: 6,
        maxEstimatedMonths: 6,
        requiredHours: 400,
        roleConstraints: {
          create: [
            {
              teamRole: {
                connect: { team_role_id: teamRoles[0].team_role_id },
              },
              minCount: 1,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[1].team_role_id },
              },
              minCount: 0,
            },
          ],
        },
      },
      {
        name: "Proyectos de investigación",
        minEstimatedMonths: 12,
        maxEstimatedMonths: 36,
        roleConstraints: {
          create: [
            {
              teamRole: {
                connect: { team_role_id: teamRoles[0].team_role_id },
              },
              minCount: 0,
            },
            {
              teamRole: {
                connect: { team_role_id: teamRoles[3].team_role_id },
              },
              minCount: 1,
            },
          ],
        },
      },
    ];

    await Promise.all(
      projectTypeSeedData.map((ptData) =>
        prisma.project_Type.create({ data: ptData })
      )
    );
  } else {
    console.log("  - No Team Roles found.");
  }
}
