// apps/mobile/src/features/projects/types/project.types.ts

/**
 * Estructura de estado que retorna la API
 */
export interface StatusObject {
  name: string
  slug: string
}

/**
 * Información del autor (puede ser outsider o profesor)
 */
export interface Author {
  fullName: string
  firstName: string
  lastName: string
  email: string | null
  organizationName: string | null
  phoneNumber: string | null
  location: string | null
}

/**
 * Tipo de proyecto con restricciones
 */
export interface ProjectType {
  project_type_id: number
  name: string
  minEstimatedMonths: number
  maxEstimatedMonths: number
  requiredHours: number
}

/**
 * Facultad
 */
export interface Faculty {
  faculty_id: number
  name: string
  abbreviation: string
}

/**
 * Tipo de problemática
 */
export interface ProblemType {
  problem_type_id: number
  name: string
}

/**
 * Archivo adjunto
 */
export interface Attachment {
  uuid_file: string
  filename: string
  mimeType: string
  size: number
  url: string
}

/**
 * Miembro del equipo
 */
export interface TeamMember {
  uuid_user: string
  fullName: string
  email: string
  roleName: string
  roleId: number
}

/**
 * Restricciones de roles para el equipo
 */
export interface RoleConstraint {
  roleId: number
  roleName: string
  min: number
  max: number | 'Infinity'
}

/**
 * Detalles de una aplicación (Application)
 */
export interface ApplicationDetails {
  uuid_application: string
  title: string
  shortDescription: string
  detailedDescription: string
  deadline: string
  createdAt: string
  status: StatusObject  
  bannerUrl: string | null
  attachments: Attachment[]
  author: Author
  faculties: Faculty[]
  projectTypes: ProjectType[]
  problemTypes: ProblemType[]
  project?: string | null  
}

/**
 * Detalles de un proyecto (Project)
 */
export interface ProjectDetails {
  uuid_project: string
  uuid_application: string
  title: string
  shortDescription: string
  detailedDescription: string
  estimatedDate: string
  createdAt: string
  approvedAt: string  
  status: StatusObject 
  bannerUrl: string | null
  attachments: Attachment[]
  author: Author
  uuidCreator: string  
  faculties: Faculty[]
  projectTypes: ProjectType[]  
  problemTypes: ProblemType[]
  teamMembers?: TeamMember[]
  teamConstraints?: Record<string, RoleConstraint>
  resources?: ProjectResource[]  

}

/**
 * Item de aplicación en listas
 */
export interface ApplicationListItem {
  uuid_application: string
  title: string
  shortDescription: string
  bannerUrl: string | null
  status: StatusObject  
  createdAt: string
}

/**
 * Item de proyecto en listas
 */
export interface ProjectListItem {
  uuid_project: string
  uuid_application: string
  title: string
  shortDescription: string
  bannerUrl: string | null
  status: StatusObject  
  createdAt: string
  approvedAt: string
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    perPage: number
    totalPages: number
    filteredItems: number
    totalItems: number
  }
}

/**
 * Rol del equipo
 */
export interface TeamRole {
  id: number
  name: string
}

/**
 * Miembro del equipo con detalles completos
 */
export interface TeamMemberDetailed {
  uuidUser: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  universityId?: string
  roleName: string
  roleId: number
}

/**
 * Miembro pendiente (antes de guardar)
 */
export interface PendingTeamMember {
  id: number // ID temporal
  uuidUser: string
  roleId: number
  user: {
    firstName: string
    middleName?: string
    lastName: string
    email: string
    universityId?: string
  }
}

/**
 * Restricción de rol
 */
export interface TeamRoleConstraint {
  min: number
  max: number | null
}

/**
 * Metadata del equipo
 */
export interface TeamMetadata {
  allowedRoles: Array<{
    teamRoleId: number
    name: string
    minCount: number
    maxCount: number | null
  }>
}

/**
 * Usuario de búsqueda
 */
export interface SearchUser {
  uuidUser: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  universityId?: string
}

/**
 * Recurso del proyecto
 */
export interface ProjectResource {
  uuid: string
  name: string
  type: string
  size: number
  downloadUrl: string
  createdAt: string
  deletedAt: string | null
  uuidAuthor: string
}