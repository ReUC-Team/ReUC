import { db } from "./db/client.js";

export const projectTypeRepo = {
  async update(id, updates) {
    return await db.project_Type.update({
      where: { project_type_id: id },
      data: { updates },
    });
  },

  async save(data) {
    return await db.project_Type.create({ data });
  },

  async getAll() {
    return await db.project_Type.findMany();
  },
  async findById(ids) {
    return await db.project_Type.findMany({
      where: { project_type_id: { in: ids } },
      select: { project_type_id: true },
    });
  },
};
