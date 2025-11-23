import { faker } from "@faker-js/faker";

const getRandomSample = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const applicationSeedData = (
  author,
  faculties,
  projectTypes,
  problemTypes,
  statuses,
  count = 15
) => {
  if (
    !author.length ||
    !faculties.length ||
    !projectTypes.length ||
    !problemTypes.length ||
    !statuses.length
  ) {
    console.log(
      "Skipping application seeding due to missing related data (author, faculties, etc.)."
    );
    return [];
  }

  const inReviewStatus = statuses.find((s) => s.slug === "in_review");

  if (!inReviewStatus) {
    console.warn(
      "Skipping application seeding due to 'in_review' status not found."
    );
    return [];
  }

  const applications = [];

  for (let i = 0; i < count; i++) {
    const randomAuthor = author[Math.floor(Math.random() * author.length)];

    const selectedFaculties = getRandomSample(
      faculties,
      Math.floor(Math.random() * 2) + 1
    ); // 1 to 2 faculties
    const selectedProjectTypes = getRandomSample(
      projectTypes,
      Math.floor(Math.random() * 1) + 1
    ); // 1 project types
    const selectedProblemTypes = getRandomSample(
      problemTypes,
      Math.floor(Math.random() * 2) + 1
    ); // 1 to 2 problem types

    const application = {
      title: faker.company.catchPhrase(),
      shortDescription: faker.lorem.sentence(),
      description: faker.lorem.paragraphs(3),
      deadline: faker.date.future({ years: 1 }),
      uuidAuthor: randomAuthor.uuid_user,
      statusId: inReviewStatus.application_status_id,

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
