import { faker } from "@faker-js/faker";

const getRandomSample = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const applicationSeedData = (
  outsiders,
  faculties,
  projectTypes,
  problemTypes,
  count = 15
) => {
  if (
    !outsiders.length ||
    !faculties.length ||
    !projectTypes.length ||
    !problemTypes.length
  ) {
    console.log(
      "Skipping application seeding due to missing related data (outsiders, faculties, etc.)."
    );
    return [];
  }

  const applications = [];

  for (let i = 0; i < count; i++) {
    const randomOutsider =
      outsiders[Math.floor(Math.random() * outsiders.length)];

    const selectedFaculties = getRandomSample(
      faculties,
      Math.floor(Math.random() * 2) + 1
    ); // 1 to 2 faculties
    const selectedProjectTypes = getRandomSample(
      projectTypes,
      Math.floor(Math.random() * 3) + 1
    ); // 1 to 3 project types
    const selectedProblemTypes = getRandomSample(
      problemTypes,
      Math.floor(Math.random() * 2) + 1
    ); // 1 to 2 problem types

    const application = {
      title: faker.company.catchPhrase(),
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(3),
      deadline: faker.date.future({ years: 1 }),
      uuidOutsider: randomOutsider.uuid_outsider,

      applicationFaculty: {
        create: selectedFaculties.map((faculty) => ({
          faculty: faculty.faculty_id,
        })),
      },
      applicationProjectType: {
        create: selectedProjectTypes.map((pt) => ({
          projectType: pt.project_type_id,
        })),
      },
      applicationProblemType: {
        create: selectedProblemTypes.map((pt) => ({
          problemType: pt.problem_type_id,
        })),
      },
    };
    applications.push(application);
  }

  return applications;
};
