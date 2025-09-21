import { db } from "./db/client.js";

export const facultyRepo = {
  async update(id, updates) {
    return await db.faculty.update({
      where: { faculty_id: id },
      data: { updates },
    });
  },

  async save(data) {
    return await db.faculty.create({ data });
  },

  async getAll() {
    return await db.faculty.findMany();
  },
  async findById(ids) {
    return await db.faculty.findMany({
      where: { faculty_id: { in: ids } },
      select: { faculty_id: true },
    });
  },
};
