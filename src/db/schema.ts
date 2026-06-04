import { relations, sql } from "drizzle-orm";
import {
  boolean,
  date,
  datetime,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  time,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const userRoleEnum = mysqlEnum("role", ["admin", "user"]);
export const attendanceStatusEnum = mysqlEnum("status", [
  "sedang_dikerjakan",
  "selesai",
  "izin",
  "sakit",
  "alpha",
]);

export const pleningTypeEnum = mysqlEnum("plening_type", [
  "sprei_hama",
  "sprei_penyakit",
  "polinasi",
  "wiwil",
  "panen",
]);

export const pleningStatusEnum = mysqlEnum("plening_status", ["menunggu", "siap", "selesai"]);

export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 180 }).notNull(),
    username: varchar("username", { length: 80 }),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: userRoleEnum.notNull().default("user"),
    phone: varchar("phone", { length: 40 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_unique").on(table.email),
    usernameIdx: uniqueIndex("users_username_unique").on(table.username),
    roleIdx: index("users_role_idx").on(table.role),
  }),
);

export const attendances = mysqlTable(
  "attendances",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    attendanceDate: date("attendance_date", { mode: "string" }).notNull(),
    workTitle: varchar("work_title", { length: 160 }).notNull(),
    workDescription: text("work_description"),
    checkInTime: time("check_in_time").notNull(),
    checkOutTime: time("check_out_time"),
    status: attendanceStatusEnum.notNull().default("sedang_dikerjakan"),
    note: varchar("note", { length: 255 }),
    photoUrl: varchar("photo_url", { length: 255 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdx: index("attendances_user_id_idx").on(table.userId),
    dateIdx: index("attendances_date_idx").on(table.attendanceDate),
    statusIdx: index("attendances_status_idx").on(table.status),
  }),
);

export const plantConditions = mysqlTable(
  "plant_conditions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recordDate: date("record_date", { mode: "string" }).notNull(),
    plantType: varchar("plant_type", { length: 120 }).notNull(),
    description: text("description").notNull(),
    plantAge: varchar("plant_age", { length: 80 }).notNull(),
    photoUrl: varchar("photo_url", { length: 255 }).notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdx: index("plant_conditions_user_id_idx").on(table.userId),
    dateIdx: index("plant_conditions_date_idx").on(table.recordDate),
  }),
);

export const waterConditions = mysqlTable(
  "water_conditions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recordDate: date("record_date", { mode: "string" }).notNull(),
    roomNumber: int("room_number").notNull(),
    initialPpm: int("initial_ppm").notNull(),
    nutrientMl: decimal("nutrient_ml", { precision: 8, scale: 2 }).notNull(),
    finalPpm: int("final_ppm").notNull(),
    initialPh: decimal("initial_ph", { precision: 4, scale: 2 }).notNull(),
    phDownMl: decimal("ph_down_ml", { precision: 8, scale: 2 }).notNull(),
    finalPh: decimal("final_ph", { precision: 4, scale: 2 }).notNull(),
    waterTemperature: decimal("water_temperature", { precision: 5, scale: 2 }).notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdx: index("water_conditions_user_id_idx").on(table.userId),
    dateIdx: index("water_conditions_date_idx").on(table.recordDate),
  }),
);

export const pleningSchedules = mysqlTable(
  "plening_schedules",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    pleningDate: date("plening_date", { mode: "string" }).notNull(),
    roomNumber: int("room_number").notNull(),
    pleningType: pleningTypeEnum.notNull(),
    status: pleningStatusEnum.notNull().default("menunggu"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdx: index("plening_schedules_user_id_idx").on(table.userId),
    dateIdx: index("plening_schedules_date_idx").on(table.pleningDate),
    statusIdx: index("plening_schedules_status_idx").on(table.status),
  }),
);

export const greenhouseMonitorings = mysqlTable(
  "greenhouse_monitorings",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    monitoringDate: date("monitoring_date", { mode: "string" }).notNull(),
    waterCondition: varchar("water_condition", { length: 160 }).notNull(),
    waterPh: decimal("water_ph", { precision: 4, scale: 2 }).notNull(),
    waterTemperature: decimal("water_temperature", { precision: 5, scale: 2 }).notNull(),
    airTemperature: decimal("air_temperature", { precision: 5, scale: 2 }).notNull(),
    humidity: decimal("humidity", { precision: 5, scale: 2 }).notNull(),
    plantCondition: varchar("plant_condition", { length: 180 }).notNull(),
    pestCondition: varchar("pest_condition", { length: 180 }).notNull(),
    notes: text("notes"),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdx: index("monitorings_user_id_idx").on(table.userId),
    dateIdx: index("monitorings_date_idx").on(table.monitoringDate),
  }),
);

export const monitoringPhotos = mysqlTable(
  "monitoring_photos",
  {
    id: int("id").autoincrement().primaryKey(),
    monitoringId: int("monitoring_id")
      .notNull()
      .references(() => greenhouseMonitorings.id, { onDelete: "cascade" }),
    photoUrl: varchar("photo_url", { length: 255 }).notNull(),
    caption: varchar("caption", { length: 160 }),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    monitoringIdx: index("photos_monitoring_id_idx").on(table.monitoringId),
  }),
);

export const comments = mysqlTable(
  "comments",
  {
    id: int("id").autoincrement().primaryKey(),
    monitoringId: int("monitoring_id")
      .notNull()
      .references(() => greenhouseMonitorings.id, { onDelete: "cascade" }),
    adminId: int("admin_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    comment: text("comment").notNull(),
    createdAt: datetime("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    monitoringIdx: index("comments_monitoring_id_idx").on(table.monitoringId),
    adminIdx: index("comments_admin_id_idx").on(table.adminId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  attendances: many(attendances),
  plantConditions: many(plantConditions),
  waterConditions: many(waterConditions),
  pleningSchedules: many(pleningSchedules),
  monitorings: many(greenhouseMonitorings),
  comments: many(comments),
}));

export const plantConditionsRelations = relations(plantConditions, ({ one }) => ({
  user: one(users, {
    fields: [plantConditions.userId],
    references: [users.id],
  }),
}));

export const waterConditionsRelations = relations(waterConditions, ({ one }) => ({
  user: one(users, {
    fields: [waterConditions.userId],
    references: [users.id],
  }),
}));

export const pleningSchedulesRelations = relations(pleningSchedules, ({ one }) => ({
  user: one(users, {
    fields: [pleningSchedules.userId],
    references: [users.id],
  }),
}));

export const attendancesRelations = relations(attendances, ({ one }) => ({
  user: one(users, {
    fields: [attendances.userId],
    references: [users.id],
  }),
}));

export const greenhouseMonitoringsRelations = relations(greenhouseMonitorings, ({ one, many }) => ({
  user: one(users, {
    fields: [greenhouseMonitorings.userId],
    references: [users.id],
  }),
  photos: many(monitoringPhotos),
  comments: many(comments),
}));

export const monitoringPhotosRelations = relations(monitoringPhotos, ({ one }) => ({
  monitoring: one(greenhouseMonitorings, {
    fields: [monitoringPhotos.monitoringId],
    references: [greenhouseMonitorings.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  monitoring: one(greenhouseMonitorings, {
    fields: [comments.monitoringId],
    references: [greenhouseMonitorings.id],
  }),
  admin: one(users, {
    fields: [comments.adminId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Attendance = typeof attendances.$inferSelect;
export type GreenhouseMonitoring = typeof greenhouseMonitorings.$inferSelect;
export type PlantCondition = typeof plantConditions.$inferSelect;
export type WaterCondition = typeof waterConditions.$inferSelect;
export type PleningSchedule = typeof pleningSchedules.$inferSelect;
