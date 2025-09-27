export async function outsiderSeedData(limit = 10) {
  try {
    const response = await fetch(`https://dummyjson.com/users?limit=${limit}`);
    const { users } = await response.json();

    const emailMap = new Map();

    return users.reduce((acc, user) => {
      const normalizedEmail = user.email.toLowerCase().trim();

      if (!emailMap.has(normalizedEmail)) {
        emailMap.set(normalizedEmail, true);
        acc.push({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          lastLoginIp: user.ip,
          outsiders: {
            create: {
              organizationName: user.company.name,
              phoneNumber: user.phone,
              location: `${user.address.address} ${user.address.state}, ${user.address.city}`,
            },
          },
        });
      }

      return acc;
    }, []);
  } catch (error) {
    return [];
  }
}
