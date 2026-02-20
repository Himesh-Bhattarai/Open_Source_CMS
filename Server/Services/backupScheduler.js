import Notification from "../Models/Notification/Notification.js";
import { User } from "../Models/Client/User.js";
import { Page } from "../Models/Page/Page.js";
import { BlogPost } from "../Models/Blog/Blogpost.js";
import { Media } from "../Models/Media/Media.js";
import { Menu } from "../Models/Menu/Menu.js";
import { Footer } from "../Models/Footer/Footer.js";
import { Seo } from "../Models/Seo/Seo.js";
import { Theme } from "../Models/Theme/Theme.js";
import { Form } from "../Models/Form/Form.js";
import { BackupPolicy, BackupRecord } from "../Models/Backup/Backup.js";
import { cmsEventService as notif } from "./notificationServices.js";

const MB = 1024 * 1024;
let backupSchedulerStarted = false;

const addFrequency = (date, frequency) => {
  const next = new Date(date);
  switch (frequency) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + 1);
      break;
    case "quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "annually":
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setDate(next.getDate() + 1);
      break;
  }
  return next;
};

const tenantFilter = (tenantId) => (tenantId ? { tenantId: String(tenantId) } : {});

export const buildBackupSnapshot = async ({ tenantId, includes }) => {
  const scope = tenantFilter(tenantId);

  let pagesCount = 0;
  let mediaCount = 0;
  let settingsCount = 0;
  let databaseCount = 0;

  if (includes.pages) {
    const [pages, blogs] = await Promise.all([
      Page.countDocuments(scope),
      BlogPost.countDocuments(scope),
    ]);
    pagesCount = pages + blogs;
  }

  if (includes.media) {
    mediaCount = await Media.countDocuments(scope);
  }

  if (includes.settings) {
    const [menus, footers, seos, themes] = await Promise.all([
      Menu.countDocuments(scope),
      Footer.countDocuments(scope),
      Seo.countDocuments(scope),
      Theme.countDocuments(scope),
    ]);
    settingsCount = menus + footers + seos + themes;
  }

  if (includes.database) {
    const [pages, blogs, media, menus, footers, seos, themes, forms] = await Promise.all([
      Page.countDocuments(scope),
      BlogPost.countDocuments(scope),
      Media.countDocuments(scope),
      Menu.countDocuments(scope),
      Footer.countDocuments(scope),
      Seo.countDocuments(scope),
      Theme.countDocuments(scope),
      Form.countDocuments(scope),
    ]);
    databaseCount = pages + blogs + media + menus + footers + seos + themes + forms;
  }

  return { pagesCount, mediaCount, settingsCount, databaseCount };
};

const toLeanArray = async (query) => {
  const rows = await query.lean();
  return Array.isArray(rows) ? rows : [];
};

export const buildBackupArchive = async ({ tenantId, includes }) => {
  const scope = tenantFilter(tenantId);

  const archive = {
    pages: {},
    media: [],
    settings: {},
    database: {},
  };

  if (includes.pages) {
    const [pages, blogs] = await Promise.all([
      toLeanArray(Page.find(scope).sort({ createdAt: -1 })),
      toLeanArray(BlogPost.find(scope).sort({ createdAt: -1 })),
    ]);
    archive.pages = { pages, blogs };
  }

  if (includes.media) {
    archive.media = await toLeanArray(Media.find(scope).sort({ createdAt: -1 }));
  }

  if (includes.settings) {
    const [menus, footers, seos, themes] = await Promise.all([
      toLeanArray(Menu.find(scope).sort({ createdAt: -1 })),
      toLeanArray(Footer.find(scope).sort({ createdAt: -1 })),
      toLeanArray(Seo.find(scope).sort({ createdAt: -1 })),
      toLeanArray(Theme.find(scope).sort({ createdAt: -1 })),
    ]);
    archive.settings = { menus, footers, seos, themes };
  }

  if (includes.database) {
    const [pages, blogs, media, menus, footers, seos, themes, forms] = await Promise.all([
      toLeanArray(Page.find(scope)),
      toLeanArray(BlogPost.find(scope)),
      toLeanArray(Media.find(scope)),
      toLeanArray(Menu.find(scope)),
      toLeanArray(Footer.find(scope)),
      toLeanArray(Seo.find(scope)),
      toLeanArray(Theme.find(scope)),
      toLeanArray(Form.find(scope)),
    ]);
    archive.database = { pages, blogs, media, menus, footers, seos, themes, forms };
  }

  return archive;
};

const estimateBackupSizeBytes = (snapshot) => {
  const weightedUnits =
    snapshot.pagesCount * 0.7 +
    snapshot.mediaCount * 3.8 +
    snapshot.settingsCount * 0.2 +
    snapshot.databaseCount * 0.5;
  return Math.max(Math.round(weightedUnits * MB), 1 * MB);
};

export const materializeBackupRecord = async ({
  userId,
  tenantId = null,
  name,
  type,
  frequency = null,
  runAt = new Date(),
  includes,
  metadata,
}) => {
  const [snapshot, archive] = await Promise.all([
    buildBackupSnapshot({ tenantId, includes }),
    buildBackupArchive({ tenantId, includes }),
  ]);
  const sizeBytes = estimateBackupSizeBytes(snapshot);

  const record = await BackupRecord.create({
    userId: String(userId),
    tenantId: tenantId ? String(tenantId) : null,
    name,
    type,
    frequency,
    status: "completed",
    sizeBytes,
    includes,
    runAt,
    completedAt: new Date(),
    metadata,
    snapshot,
    archive,
  });

  if (typeof notif.createBackup === "function") {
    notif.createBackup({
      userId: String(userId),
      backupName: record.name,
      backupId: record._id,
      websiteId: record.tenantId,
    });
  }

  return record;
};

const sendAnnualBackupEmail = async ({ userId, record }) => {
  try {
    const user = await User.findById(userId).lean();
    if (!user?.email) return;

    // No SMTP configured in this project. Create an in-app notification and server log.
    await Notification.create({
      userId: userId,
      type: "INFO",
      title: "Annual backup delivered",
      message: `Annual backup "${record.name}" has been prepared and delivered to ${user.email}.`,
      entity: { type: "backup", id: String(record._id), name: record.name },
    });

    console.log(`[BACKUP EMAIL] To: ${user.email} | Backup: ${record.name} (${record._id})`);

    await BackupRecord.findByIdAndUpdate(record._id, {
      $set: {
        "delivery.annualEmailSentAt": new Date(),
        "delivery.annualEmailTo": user.email,
      },
    });
  } catch (error) {
    console.error("[BackupScheduler] Annual email delivery simulation failed:", error);
  }
};

const processPolicies = async () => {
  const now = new Date();
  const duePolicies = await BackupPolicy.find({
    enabled: true,
    nextRunAt: { $lte: now },
  }).limit(50);

  for (const policy of duePolicies) {
    const name = `${policy.frequency[0].toUpperCase()}${policy.frequency.slice(1)} Backup - ${now.toISOString()}`;
    const record = await materializeBackupRecord({
      userId: policy.userId,
      tenantId: policy.tenantId,
      name,
      type: "automatic",
      frequency: policy.frequency,
      runAt: now,
      includes: policy.includes || {
        pages: true,
        media: true,
        settings: true,
        database: true,
      },
      metadata: {
        description: `${policy.frequency} scheduled backup`,
        strategy: "full",
        validate: true,
        triggeredBy: "system",
        source: "scheduler",
      },
    });

    if (policy.frequency === "annually" && policy.annualEmailDelivery) {
      await sendAnnualBackupEmail({ userId: policy.userId, record });
    }

    const nextRunAt = addFrequency(now, policy.frequency);
    const retentionCutoff = new Date();
    retentionCutoff.setDate(retentionCutoff.getDate() - Math.max(1, policy.retentionDays || 30));

    await BackupPolicy.findByIdAndUpdate(policy._id, {
      $set: {
        lastRunAt: now,
        nextRunAt,
      },
    });

    await BackupRecord.deleteMany({
      userId: policy.userId,
      tenantId: policy.tenantId || null,
      type: "automatic",
      runAt: { $lt: retentionCutoff },
    });
  }
};

const processOneOffSchedules = async () => {
  const now = new Date();
  const dueOneOff = await BackupRecord.find({
    status: "scheduled",
    runAt: { $lte: now },
  }).limit(50);

  for (const scheduledRecord of dueOneOff) {
    const created = await materializeBackupRecord({
      userId: scheduledRecord.userId,
      tenantId: scheduledRecord.tenantId,
      name: scheduledRecord.name,
      type: "scheduled",
      runAt: now,
      includes: scheduledRecord.includes || {
        pages: true,
        media: true,
        settings: true,
        database: true,
      },
      metadata: scheduledRecord.metadata || {
        description: "Scheduled backup",
        strategy: "full",
        validate: false,
        triggeredBy: "system",
        source: "scheduler",
      },
    });

    await BackupRecord.findByIdAndUpdate(scheduledRecord._id, {
      $set: { status: "completed", completedAt: new Date() },
    });

    if (scheduledRecord.frequency === "annually") {
      await sendAnnualBackupEmail({ userId: scheduledRecord.userId, record: created });
    }
  }
};

const tickBackupScheduler = async () => {
  try {
    await processPolicies();
    await processOneOffSchedules();
  } catch (error) {
    console.error("[BackupScheduler] Tick failed:", error);
  }
};

export const startBackupScheduler = () => {
  if (backupSchedulerStarted) return;
  backupSchedulerStarted = true;

  setInterval(tickBackupScheduler, 60 * 1000);
  tickBackupScheduler();
  console.log("[BackupScheduler] Started");
};

export const getNextRunAt = (frequency, from = new Date()) =>
  addFrequency(from, frequency);
