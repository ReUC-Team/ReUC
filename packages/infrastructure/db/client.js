import { PrismaClient } from "../generated/prisma/client.js";

// key => PrismaClient model
// value => PostgreSQL table
export const tableNames = {
  admin: "Admins",
  application: "Applications",
  outsider: "Outsiders",
  professor: "Professors",
  professor_Role: "Professor_Roles",
  project: "Projects",
  project_Type: "Project_Types",
  student: "Students",
  student_Status: "Student_Statuses",
  user: "Users",
  user_Status: "User_Statuses",
  application_Project_Type: "Application_Project_Types",
  application_Faculty: "Application_Faculties",
  application_Problem_Type: "Application_Problem_Types",
  faculty: "Faculties",
  problem_Type: "Problem_Types",
};

export const tableSchemas = {
  admin: {
    uuid_admin: {
      nameMapped: "uuid_admin",
      dataType: "String",
      isNullable: false,
    },
    uuidUser: {
      nameMapped: "uuid_user",
      dataType: "String",
      isNullable: false,
    },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  application: {
    uuid_application: {
      nameMapped: "uuid_application",
      dataType: "String",
      isNullable: false,
    },
    uuidOutsider: {
      nameMapped: "uuid_outsider",
      dataType: "String",
      isNullable: false,
    },
    title: {
      nameMapped: "title",
      dataType: "String",
      isNullable: false,
    },
    shortDescription: {
      nameMapped: "short_description",
      dataType: "String",
      isNullable: true,
    },
    description: {
      nameMapped: "description",
      dataType: "String",
      isNullable: true,
    },
    deadline: {
      nameMapped: "deadline",
      dataType: "DateTime",
      isNullable: false,
    },
    visibility: {
      nameMapped: "visibility",
      dataType: "String",
      isNullable: true,
    },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  outsider: {
    uuid_outsider: {
      nameMapped: "uuid_outsider",
      dataType: "String",
      isNullable: false,
    },
    uuidUser: {
      nameMapped: "uuid_user",
      dataType: "String",
      isNullable: false,
    },
    organizationName: {
      nameMapped: "organization_name",
      dataType: "String",
      isNullable: true,
    },
    phoneNumber: {
      nameMapped: "phone_number",
      dataType: "String",
      isNullable: true,
    },
    location: {
      nameMapped: "location",
      dataType: "String",
      isNullable: true,
    },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  professor: {
    uuid_professor: {
      nameMapped: "uuid_professor",
      dataType: "String",
      isNullable: false,
    },
    uuidUser: {
      nameMapped: "uuid_user",
      dataType: "String",
      isNullable: false,
    },
    universityId: {
      nameMapped: "university_id",
      dataType: "String",
      isNullable: false,
    },
    role: {
      nameMapped: "professor_role_id",
      dataType: "Int",
      isNullable: true,
    },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  professor_Role: {
    professor_role_id: {
      nameMapped: "professor_role_id",
      dataType: "Int",
      isNullable: false,
    },
    name: { nameMapped: "name", dataType: "String", isNullable: false },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  project: {},
  project_Type: {
    project_type_id: {
      nameMapped: "project_type_id",
      dataType: "Int",
      isNullable: false,
    },
    name: { nameMapped: "name", dataType: "String", isNullable: false },
    estimatedTime: {
      nameMapped: "estimated_time",
      dataType: "String",
      isNullable: false,
    },
    minTeamMembersSize: {
      nameMapped: "min_team_members_size",
      dataType: "Int",
      isNullable: false,
    },
    maxTeamMembersSize: {
      nameMapped: "max_team_members_size",
      dataType: "Int",
      isNullable: false,
    },
    minTeamAdvisorsSize: {
      nameMapped: "min_team_advisors_size",
      dataType: "Int",
      isNullable: false,
    },
    maxTeamAdvisorsSize: {
      nameMapped: "max_team_advisors_size",
      dataType: "Int",
      isNullable: false,
    },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  student: {
    uuid_student: {
      nameMapped: "uuid_student",
      dataType: "String",
      isNullable: false,
    },
    uuidUser: {
      nameMapped: "uuid_user",
      dataType: "String",
      isNullable: false,
    },
    universityId: {
      nameMapped: "university_id",
      dataType: "String",
      isNullable: false,
    },
    averageGrade: {
      nameMapped: "average_grade",
      dataType: "Float",
      isNullable: true,
    },
    enrollmentYear: {
      nameMapped: "enrollment_year",
      dataType: "DateTime",
      isNullable: true,
    },
    status: {
      nameMapped: "student_status_id",
      dataType: "Int",
      isNullable: true,
    },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  student_Status: {
    student_status_id: {
      nameMapped: "student_status_id",
      dataType: "Int",
      isNullable: false,
    },
    name: { nameMapped: "name", dataType: "String", isNullable: false },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  user: {
    uuid_user: {
      nameMapped: "uuid_user",
      dataType: "String",
      isNullable: false,
    },
    email: { nameMapped: "email", dataType: "String", isNullable: false },
    password: { nameMapped: "password", dataType: "String", isNullable: false },
    firstName: {
      nameMapped: "first_name",
      dataType: "String",
      isNullable: true,
    },
    middleName: {
      nameMapped: "middle_name",
      dataType: "String",
      isNullable: true,
    },
    lastName: {
      nameMapped: "last_name",
      dataType: "String",
      isNullable: true,
    },
    status: {
      nameMapped: "user_status_id",
      dataType: "Int",
      isNullable: true,
    },
    lastLoginIp: {
      nameMapped: "last_login_ip",
      dataType: "String",
      isNullable: true,
    },
    lastLoginAt: {
      nameMapped: "last_login_at",
      dataType: "DateTime",
      isNullable: true,
    },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  user_Status: {
    user_status_id: {
      nameMapped: "user_status_id",
      dataType: "Int",
      isNullable: false,
    },
    name: { nameMapped: "name", dataType: "String", isNullable: false },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  application_Project_Type: {
    application: {
      nameMapped: "uuid_application",
      dataType: "String",
      isNullable: false,
    },
    projectType: {
      nameMapped: "project_type_id",
      dataType: "Int",
      isNullable: false,
    },
  },
  application_Faculty: {
    application: {
      nameMapped: "uuid_application",
      dataType: "String",
      isNullable: false,
    },
    faculty: {
      nameMapped: "faculty_id",
      dataType: "Int",
      isNullable: false,
    },
  },
  application_Problem_Type: {
    application: {
      nameMapped: "uuid_application",
      dataType: "String",
      isNullable: false,
    },
    problemType: {
      nameMapped: "problem_type_id",
      dataType: "Int",
      isNullable: false,
    },
  },
  faculty: {
    faculty_id: {
      nameMapped: "faculty_id",
      dataType: "Int",
      isNullable: false,
    },
    name: { nameMapped: "name", dataType: "String", isNullable: false },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
  problem_Type: {
    problem_type_id: {
      nameMapped: "problem_type_id",
      dataType: "Int",
      isNullable: false,
    },
    name: { nameMapped: "name", dataType: "String", isNullable: false },
    createdAt: {
      nameMapped: "created_at",
      dataType: "DateTime",
      isNullable: false,
    },
    updatedAt: {
      nameMapped: "updated_at",
      dataType: "DateTime",
      isNullable: false,
    },
  },
};

export const db = new PrismaClient();
