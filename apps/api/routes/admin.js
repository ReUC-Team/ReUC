import express from "express";
import csrf from "csurf";
import { authMiddleware, requireRole } from "../middleware/auth.js";
import asyncHandler from "../utils/asyncHandler.js";
import admin from "@reuc/application/admin/index.js";

export const adminRouter = express.Router();

adminRouter.use(authMiddleware, requireRole("admin"));

const csrfProtection = csrf({ cookie: true });

// -- ROUTES --

adminRouter.get(
  "/meta/tables/",
  asyncHandler(async (req, res, next) => {
    const { tables } = admin.getTableNames();

    res.status(200).json({
      success: true,
      data: { tables },
    });
  })
);

adminRouter.get(
  "/meta/tables/:table/fields",
  asyncHandler(async (req, res, next) => {
    const { table } = req.params;

    const { schema } = admin.getTableSchema({ table });

    return res.status(200).json({
      success: true,
      data: { schema },
    });
  })
);

adminRouter.post(
  "/data/:table/",
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const { table } = req.params;
    const { page, perPage, query, sort } = req.body;

    const { records } = await admin.getLimitedTableRecords({
      table,
      page,
      perPage,
      query,
      sort,
    });

    return res.status(200).json({
      success: true,
      data: { records },
    });
  })
);
