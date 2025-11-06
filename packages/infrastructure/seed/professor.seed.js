export async function professorSeedData(limit = 5, skip = 0, professorRoles) {
  if (!professorRoles || professorRoles.length === 0) {
    console.warn(
      "  - professor.seed.js: No professor roles found. Skipping professor creation."
    );
    return [];
  }

  try {
    const response = await fetch(
      `https://dummyjson.com/users?limit=${limit}&skip=${skip}`
    );
    const { users } = await response.json();

    const emailMap = new Map();
    const universityIdSet = new Set();

    return users.reduce((acc, user) => {
      const normalizedEmail = user.email.toLowerCase().trim();

      if (!emailMap.has(normalizedEmail)) {
        emailMap.set(normalizedEmail, true);

        // 1. Generate unique 4-digit universityId
        let universityId;
        do {
          universityId = Math.floor(1000 + Math.random() * 9000).toString();
        } while (universityIdSet.has(universityId));
        universityIdSet.add(universityId);

        // 2. Get random professor role
        const randomRole =
          professorRoles[Math.floor(Math.random() * professorRoles.length)];

        acc.push({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLoginIp: user.ip,
          professor: {
            create: {
              universityId: universityId,
              role: randomRole.professor_role_id,
            },
          },
        });
      }

      return acc;
    }, []);
  } catch (error) {
    console.error("  - Error in professorSeedData:", error.message);
    return [];
  }
}
