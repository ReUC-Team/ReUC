export async function studentSeedData(limit = 10, skip = 0, studentStatuses) {
  if (!studentStatuses || studentStatuses.length === 0) {
    console.warn(
      "  - student.seed.js: No student statuses found. Skipping student creation."
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

        // 1. Generate unique 8-digit universityId
        let universityId;
        do {
          universityId = Math.floor(
            10000000 + Math.random() * 90000000
          ).toString();
        } while (universityIdSet.has(universityId));
        universityIdSet.add(universityId);

        // 2. Get random student status
        const randomStatus =
          studentStatuses[Math.floor(Math.random() * studentStatuses.length)];

        // 3. Generate random enrollment year (e.g., 2018-2023)
        const randomYear = Math.floor(Math.random() * (2023 - 2018 + 1)) + 2018;
        const enrollmentYear = new Date(randomYear, 8, 1); // Sept 1st of random year

        // 4. Generate random average grade (e.g., 6.0 - 9.9)
        const averageGrade = parseFloat(
          (Math.random() * (9.9 - 6.0) + 6.0).toFixed(2)
        );

        acc.push({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLoginIp: user.ip,
          student: {
            create: {
              universityId: universityId,
              averageGrade: averageGrade,
              enrollmentYear: enrollmentYear,
              status: randomStatus.student_status_id,
            },
          },
        });
      }

      return acc;
    }, []);
  } catch (error) {
    console.error("  - Error in studentSeedData:", error.message);
    return [];
  }
}
