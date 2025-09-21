import { db } from "./db/client.js";

export const problemTypeRepo = {
  async update(id, updates) {
    return await db.problem_Type.update({
      where: { problem_type_id: id },
      data: { updates },
    });
  },

  async save(data) {
    return await db.problem_Type.create({ data });
  },
  async findById(ids) {
    return await db.problem_Type.findMany({
      where: { problem_type_id: { in: ids } },
      select: { problem_type_id: true },
    });
  },
  async findByNameOrCreate(name) {
    const existing = await db.problem_Type.findUnique({ where: { name } });

    if (existing) return existing;

    try {
      return await db.problem_Type.create({ data: name });
    } catch (e) {
      // Unique constraint failed — another request probably created it in parallel
      if (e.code === "P2002")
        return await db.problem_Type.findUnique({ where: { name } });

      throw e;
    }
  },

  async getAll() {
    return await db.problem_Type.findMany();
  },
  async getLimited(offset, limit) {
    return await db.problem_Type.findMany({
      skip: offset,
      take: limit,
    });
  },
};
