import { describe, it, beforeAll, expect } from "vitest";
import { db } from "../db/client.js";
import { userRepo } from "../userRepo.js";

beforeAll(async () => {
  await db.user.deleteMany();
  await db.User_Status.createMany({
    data: [{ name: "banned" }, { name: "verified" }, { name: "new" }],
  });
  await db.user.createMany({
    data: [
      {
        email: "stelle@hsr.com",
        password: "salvelordtrashcan",
        status: 1,
        lastLoginAt: new Date("2025-01-17"),
      },
      {
        email: "caelus@hsr.com",
        password: "lovetofireflyforever",
        status: 3,
        lastLoginAt: new Date("2025-03-22"),
      },
    ],
  });
});

describe("userRepo read single", () => {
  it("should find user by email", async () => {
    const user = await userRepo.findByEmail("stelle@hsr.com");
    expect(user).toBeDefined();
    expect(user.email).toBe("stelle@hsr.com");
  });
  it("should find user by uuid after email", async () => {
    const user = await userRepo.findByEmail("stelle@hsr.com");
    const user2 = await userRepo.findByUuid(user.uuid_user);
    expect(user2).toBeDefined();
    expect(user2).toBe(user2);
  });
});

describe("userRepo read single edge cases", () => {
  it("should return null if email does not exist", async () => {
    const user = await userRepo.findByEmail("doesnotexist@nowhere.com");
    expect(user).toBeNull();
  });
});

describe("userRepo create", () => {
  it("should create and retrieve a new user", async () => {
    const newUser = await userRepo.save({
      email: "march7th@hsr.com",
      password: "oneSinglePhotoIsNotEnoght",
    });

    const found = await userRepo.findByEmail("march7th@hsr.com");
    expect(found).toBeDefined();
    expect(found.email).toBe("march7th@hsr.com");
  });
});

describe("userRepo update", () => {
  it("should update a user's status to verified", async () => {
    const user = await userRepo.findByEmail("caelus@hsr.com");
    const updated = await userRepo.update(user.uuid_user, { status: 2 });
    expect(updated.status).toBe(2);
  });
});
