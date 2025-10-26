import { PrismaClient, Prisma } from "@prisma/client";
import { FileService } from "@reuc/file-storage/services/FileService.js";
import { createStorageAdapter } from "@reuc/file-storage/services/storageFactory.js";

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
  // application_Project_Type: "Application_Project_Types", // Linking Tables without standard schema
  // application_Faculty: "Application_Faculties", // Linking Tables without standard schema
  // application_Problem_Type: "Application_Problem_Types", // Linking Tables without standard schema
  faculty: "Faculties",
  problem_Type: "Problem_Types",
  project_Status: "Project_Statuses",
  file: "Files",
  file_Link: "File_Links", // Linking Table with standard schema
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
      isNullable: false,
    },
    description: {
      nameMapped: "description",
      dataType: "String",
      isNullable: false,
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
  project_Status: {
    project_status_id: {
      nameMapped: "project_status_id",
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
  file: {
    uuid_file: {
      nameMapped: "uuid_file",
      dataType: "String",
      isNullable: false,
    },
    storedPath: {
      nameMapped: "stored_path",
      dataType: "String",
      isNullable: false,
    },
    storedName: {
      nameMapped: "stored_name",
      dataType: "String",
      isNullable: true,
    },
    originalName: {
      nameMapped: "original_name",
      dataType: "String",
      isNullable: true,
    },
    mimetype: { nameMapped: "mimetype", dataType: "String", isNullable: false },
    fileSize: { nameMapped: "file_size", dataType: "Int", isNullable: false },
    fileKind: {
      nameMapped: "file_kind",
      dataType: "String",
      isNullable: false,
    },
    isAsset: {
      nameMapped: "is_asset",
      dataType: "Boolean",
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
  file_Link: {
    file_link_id: {
      nameMapped: "file_link_id",
      dataType: "Int",
      isNullable: false,
    },
    modelTarget: {
      nameMapped: "model_target",
      dataType: "String",
      isNullable: false,
    },
    uuidTarget: {
      nameMapped: "uuid_target",
      dataType: "String",
      isNullable: false,
    },
    purpose: {
      nameMapped: "purpose",
      dataType: "String",
      isNullable: false,
    },
    uuidFile: {
      nameMapped: "uuid_file",
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
};

export const db = new PrismaClient();

export const isPrismaError = (err) =>
  err instanceof Prisma.PrismaClientKnownRequestError;

let fileServiceInstance;
(() => {
  try {
    const adapter = createStorageAdapter();
    fileServiceInstance = new FileService(adapter);
  } catch (err) {
    console.error(err.message, err.stack);

    process.exit(1);
  }
})();

/**
 * Gets the File Service class created on app init.
 * If service is not created sucessfully it throws error.
 * @returns {FileService}
 * @throws {Error}
 */
export const getFileService = () => {
  if (!fileServiceInstance)
    throw new Error("File Service has not been initialized.");

  return fileServiceInstance;
};
