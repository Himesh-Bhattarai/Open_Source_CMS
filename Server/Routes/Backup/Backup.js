import express from "express";
import { verificationMiddleware } from "../../Utils/Jwt/Jwt.js";
import { BackupPolicy, BackupRecord } from "../../Models/Backup/Backup.js";
import { getNextRunAt, materializeBackupRecord } from "../../Services/backupScheduler.js";
import { cmsEventService as notif } from "../../Services/notificationServices.js";

const router = express.Router();

const parseIncludes = (includes = {}) => ({
  pages: includes.pages !== false,
  media: includes.media !== false,
  settings: includes.settings !== false,
  database: includes.database !== false,
});

const buildIncludesLabel = (includes) =>
  Object.entries(includes)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);

router.get("/list", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { tenantId, frequency, status, include, scope = "all", limit = "100" } = req.query;

    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const filter = { userId: String(userId) };
    if (scope === "tenant" && tenantId) filter.tenantId = String(tenantId);
    if (scope === "all") delete filter.tenantId;
    if (frequency) filter.frequency = String(frequency);
    if (status) filter.status = String(status);

    if (include && include !== "all-data") {
      filter[`includes.${String(include)}`] = true;
    }

    const parsedLimit = Math.min(Number(limit) || 100, 500);
    const data = await BackupRecord.find(filter).sort({ createdAt: -1 }).limit(parsedLimit);

    return res.status(200).json({ ok: true, data, count: data.length });
  } catch (err) {
    next(err);
  }
});

router.get("/settings", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { tenantId } = req.query;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const filter = { userId: String(userId), tenantId: tenantId ? String(tenantId) : null };
    const policies = await BackupPolicy.find(filter).sort({ frequency: 1 });
    return res.status(200).json({ ok: true, data: policies });
  } catch (err) {
    next(err);
  }
});

router.put("/settings", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const {
      tenantId = null,
      frequency,
      retentionDays = 30,
      includes = {},
      enabled = true,
      annualEmailDelivery = true,
      timezone = "UTC",
    } = req.body || {};

    if (!frequency) {
      return res.status(400).json({ ok: false, message: "frequency is required" });
    }

    const normalizedIncludes = parseIncludes(includes);
    const now = new Date();
    const nextRunAt = getNextRunAt(frequency, now);

    const policy = await BackupPolicy.findOneAndUpdate(
      { userId: String(userId), tenantId: tenantId ? String(tenantId) : null, frequency },
      {
        $set: {
          enabled,
          retentionDays: Number(retentionDays) || 30,
          includes: normalizedIncludes,
          timezone,
          annualEmailDelivery,
          nextRunAt,
        },
      },
      { upsert: true, new: true },
    );

    return res.status(200).json({ ok: true, data: policy });
  } catch (err) {
    next(err);
  }
});

router.post("/create", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const {
      tenantId = null,
      type = "manual",
      strategy = "full",
      includes = {},
      name = "",
      description = "",
      validate = false,
      scheduledAt = null,
      frequency = null,
    } = req.body || {};

    const normalizedIncludes = parseIncludes(includes);
    const title =
      name ||
      `${type === "scheduled" ? "Scheduled" : "Manual"} Backup - ${new Date().toLocaleString()}`;

    if (type === "scheduled" && scheduledAt) {
      const runAt = new Date(scheduledAt);
      const scheduledRecord = await BackupRecord.create({
        userId: String(userId),
        tenantId: tenantId ? String(tenantId) : null,
        name: title,
        type: "scheduled",
        frequency: frequency || null,
        status: "scheduled",
        includes: normalizedIncludes,
        runAt,
        metadata: {
          description,
          strategy,
          validate: !!validate,
          triggeredBy: "user",
          source: "cms-ui",
        },
      });

      return res.status(201).json({
        ok: true,
        data: scheduledRecord,
        includesLabel: buildIncludesLabel(normalizedIncludes),
      });
    }

    const record = await materializeBackupRecord({
      userId: String(userId),
      tenantId: tenantId ? String(tenantId) : null,
      name: title,
      type: "manual",
      frequency: frequency || null,
      runAt: new Date(),
      includes: normalizedIncludes,
      metadata: {
        description,
        strategy,
        validate: !!validate,
        triggeredBy: "user",
        source: "cms-ui",
      },
    });

    return res.status(201).json({
      ok: true,
      data: record,
      includesLabel: buildIncludesLabel(normalizedIncludes),
    });
  } catch (err) {
    next(err);
  }
});

router.post("/restore", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { backupId, strategy = "replace", dryRun = false, notify = false } = req.body || {};
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (!backupId) return res.status(400).json({ ok: false, message: "backupId is required" });

    const backup = await BackupRecord.findById(backupId);
    if (!backup) return res.status(404).json({ ok: false, message: "Backup not found" });
    if (String(backup.userId) !== String(userId)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    if (!dryRun) {
      backup.status = "restored";
      await backup.save();
    }

    if (notify && typeof notif.restoreBackup === "function") {
      notif.restoreBackup({
        userId: String(userId),
        backupName: backup.name,
        backupId: backup._id,
        websiteId: backup.tenantId,
      });
    }

    return res.status(200).json({
      ok: true,
      message: dryRun ? "Dry run restore completed" : "Backup restored",
      data: { backupId, strategy, dryRun },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/download/:backupId", verificationMiddleware, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { backupId } = req.params;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });

    const backup = await BackupRecord.findById(backupId);
    if (!backup) return res.status(404).json({ ok: false, message: "Backup not found" });
    if (String(backup.userId) !== String(userId)) {
      return res.status(403).json({ ok: false, message: "Forbidden" });
    }

    const payload = {
      backupId: backup._id,
      name: backup.name,
      exportedAt: new Date().toISOString(),
      includes: backup.includes,
      snapshot: backup.snapshot,
      archive: backup.archive || {},
      metadata: backup.metadata,
      runAt: backup.runAt,
      status: backup.status,
      tenantId: backup.tenantId,
      frequency: backup.frequency,
      type: backup.type,
    };

    const safeName = String(backup.name || "backup")
      .replace(/[^a-zA-Z0-9-_]+/g, "_")
      .slice(0, 80);
    const fileName = `${safeName}_${new Date().toISOString().slice(0, 10)}.json`;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=\"${fileName}\"`);
    return res.status(200).send(JSON.stringify(payload, null, 2));
  } catch (err) {
    next(err);
  }
});

export default router;
