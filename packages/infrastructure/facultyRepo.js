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
  async findIdsByNames(names) {
    return await db.faculty.findMany({
      where: { name: { in: names } },
      select: { faculty_id: true },
    });
  },
};
